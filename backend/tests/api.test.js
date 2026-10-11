const http = require('http');
const app = require('../app');

function makeRequest(server, method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const options = {
      hostname: '127.0.0.1',
      port: addr.port,
      path: path,
      method: method,
      headers: { ...headers }
    };

    if (body) {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (_) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json || data });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runApiTests() {
  console.log('=== RUNNING API INTEGRATION TESTS ===\n');
  const server = http.createServer(app);

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

  try {
    // 1. Healthcheck Test
    console.log('TEST 1: Healthcheck Endpoint (GET /api/health)');
    const health = await makeRequest(server, 'GET', '/api/health');
    if (health.status !== 200) throw new Error(`Healthcheck returned status ${health.status}`);
    if (!health.body.status || !health.body.database || !health.body.nlpDaemon) {
      throw new Error('Healthcheck response structure invalid');
    }
    console.log('  PASS: Healthcheck returns 200 and healthy metrics (DB:', health.body.database.status, ', Daemon:', health.body.nlpDaemon.status + ')');

    // 2. Notes List Test
    console.log('\nTEST 2: Fetch Notes (GET /api/notes)');
    const notesRes = await makeRequest(server, 'GET', '/api/notes');
    if (notesRes.status !== 200) throw new Error(`Notes endpoint returned status ${notesRes.status}`);
    if (!Array.isArray(notesRes.body)) throw new Error('Notes endpoint should return array');
    console.log(`  PASS: Notes list returned ${notesRes.body.length} notes`);

    // 3. Guarded Delete Protection Test
    console.log('\nTEST 3: Bulk Delete Safety Guard (DELETE /api/notes without confirm)');
    const delGuarded = await makeRequest(server, 'DELETE', '/api/notes');
    if (delGuarded.status !== 400) {
      throw new Error(`Expected status 400 for unconfirmed bulk delete, got ${delGuarded.status}`);
    }
    console.log('  PASS: Bulk delete correctly blocked with 400 when missing confirmation');

    // 4. WordNet Dictionary Test
    console.log('\nTEST 4: WordNet Dictionary Endpoint (GET /api/wordnet/photosynthesis)');
    const wnRes = await makeRequest(server, 'GET', '/api/wordnet/photosynthesis');
    if (wnRes.status !== 200) throw new Error(`WordNet query returned status ${wnRes.status}`);
    if (!wnRes.body || !wnRes.body.synsets || wnRes.body.synsets.length === 0) {
      throw new Error('Expected synsets in WordNet response');
    }
    const resolvedWord = wnRes.body.word || wnRes.body.lemma || 'photosynthesis';
    console.log(`  PASS: WordNet resolved word "${resolvedWord}" with ${wnRes.body.synsets.length} synsets and definition: "${wnRes.body.definition.slice(0, 45)}..."`);

    console.log('\n>>> ALL API INTEGRATION TESTS PASSED SUCCESSFULLY! <<<\n');
    server.close(() => {
      process.exit(0);
    });
  } catch (err) {
    server.close();
    throw err;
  }
}

runApiTests().catch(err => {
  console.error('\nAPI Test Failed:', err.message);
  process.exit(1);
});
