import sys
import json
import os

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

try:
    from nltk.corpus import wordnet as wn
    from nltk.corpus import stopwords
    from nltk.corpus import names
except ImportError:
    import nltk
    nltk.download('wordnet')
    nltk.download('stopwords')
    nltk.download('names')
    from nltk.corpus import wordnet as wn
    from nltk.corpus import stopwords
    from nltk.corpus import names

# Pre-cache names set for O(1) proper noun lookup
NAMES_SET = None

def get_names_set():
    global NAMES_SET
    if NAMES_SET is None:
        try:
            NAMES_SET = set(n.lower() for n in names.words())
        except Exception:
            NAMES_SET = set()
    return NAMES_SET

def is_proper_noun(word):
    clean = word.strip()
    lower = clean.lower()
    
    # 1. Check NLTK names corpus
    if lower in get_names_set():
        return True

    # 2. Check WordNet for instance hypernyms (proper nouns/named entities in WordNet)
    synsets = wn.synsets(lower) or wn.synsets(clean)
    if synsets:
        for s in synsets:
            # Check if any synset is an instance of something (e.g. person, location, entity)
            if s.instance_hypernyms():
                return True
            for path in s.hypernym_paths():
                path_names = [h.name().split('.')[0] for h in path]
                if any(x in path_names for x in ['person', 'scientist', 'deity', 'calendar_month', 'day_of_the_week', 'country', 'city']):
                    return True
    return False

def get_wordnet_data(word):
    word_clean = word.strip().lower()
    synsets = wn.synsets(word_clean)
    
    # Morphy / lemmatization fallback using NLTK WordNet morphy
    if not synsets:
        morph_n = wn.morphy(word_clean, wn.NOUN)
        if morph_n:
            synsets = wn.synsets(morph_n)
    if not synsets:
        morph_v = wn.morphy(word_clean, wn.VERB)
        if morph_v:
            synsets = wn.synsets(morph_v)
    if not synsets:
        morph_a = wn.morphy(word_clean, wn.ADJ)
        if morph_a:
            synsets = wn.synsets(morph_a)
    if not synsets:
        morph_r = wn.morphy(word_clean, wn.ADV)
        if morph_r:
            synsets = wn.synsets(morph_r)

    # Simple suffix fallbacks if still not found
    if not synsets and word_clean.endswith('s'):
        synsets = wn.synsets(word_clean[:-1])
    if not synsets and word_clean.endswith('es'):
        synsets = wn.synsets(word_clean[:-2])
    if not synsets and word_clean.endswith('ies'):
        synsets = wn.synsets(word_clean[:-3] + 'y')

    if not synsets:
        # Check if it's an authentic name in NLTK Names corpus
        if word_clean in get_names_set():
            male_set = set(n.lower() for n in names.words('male.txt'))
            female_set = set(n.lower() for n in names.words('female.txt'))
            is_m = word_clean in male_set
            is_f = word_clean in female_set
            gender = "masculine" if (is_m and not is_f) else ("feminine" if (is_f and not is_m) else "given")
            cap_lemma = word_clean.capitalize()
            return {
                'word': word_clean,
                'lemma': cap_lemma,
                'synset': f"{word_clean}.nnp.nltk_names",
                'pos': 'prop. n. (proper noun)',
                'definition': f"Personal given name ({gender}) recorded in the NLTK Names Corpus; functions as a named entity / person in study note contexts.",
                'hypernym': f"person → proper noun → given name ({gender})",
                'synonyms': [cap_lemma, "named entity", "proper name"],
                'examples': [f"{cap_lemma} is referenced in the study note as a key person."],
                'synsets': [{
                    'synset': f"{word_clean}.nnp.nltk_names",
                    'pos': 'prop. n. (proper noun)',
                    'definition': f"Personal given name ({gender}) recorded in the NLTK Names Corpus; functions as a named entity / person in study note contexts.",
                    'hypernym': f"person → proper noun → given name ({gender})",
                    'synonyms': [cap_lemma, "named entity", "proper name"],
                    'examples': [f"{cap_lemma} is referenced in the study note as a key person."]
                }]
            }
        return None

    pos_map = {
        'n': 'n. (noun)',
        'v': 'v. (verb)',
        'a': 'adj. (adjective)',
        's': 'adj. (adjective)',
        'r': 'adv. (adverb)'
    }

    results = []
    for s in synsets:
        # Build clean hypernym hierarchy pathway from WordNet ontology tree
        hyp_paths = []
        paths = s.hypernym_paths()
        if paths:
            # Pick the most specific informative path
            for path in paths:
                chain = [h.lemma_names()[0].replace('_', ' ') for h in path[-3:]]
                if chain:
                    hyp_paths.append(' → '.join(chain))
        elif s.instance_hypernyms():
            chain = [h.lemma_names()[0].replace('_', ' ') for h in s.instance_hypernyms()]
            if chain:
                hyp_paths.append('instance of → ' + ' → '.join(chain))

        synonyms = []
        for l in s.lemma_names():
            name = l.replace('_', ' ')
            if name.lower() != word_clean and name not in synonyms:
                synonyms.append(name)

        results.append({
            'synset': s.name(),
            'pos': pos_map.get(s.pos(), s.pos()),
            'definition': s.definition(),
            'hypernym': hyp_paths[0] if hyp_paths else 'entity',
            'synonyms': synonyms[:5],
            'examples': s.examples()[:2] if s.examples() else []
        })

    primary_lemma = synsets[0].lemma_names()[0].replace('_', ' ') if synsets else word_clean
    return {
        'word': word_clean,
        'lemma': primary_lemma,
        'synset': results[0]['synset'],
        'pos': results[0]['pos'],
        'definition': results[0]['definition'],
        'hypernym': results[0]['hypernym'],
        'synonyms': results[0]['synonyms'],
        'synsets': results
    }

def export_nltk_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    # Export NLTK English stopwords
    sw = stopwords.words('english')
    with open(os.path.join(data_dir, 'nltk_stopwords.json'), 'w', encoding='utf-8') as f:
        json.dump(sw, f, indent=2)
        
    # Export NLTK names
    all_names = sorted(list(get_names_set()))
    with open(os.path.join(data_dir, 'nltk_names.json'), 'w', encoding='utf-8') as f:
        json.dump(all_names, f, indent=2)
        
    print(f"Exported {len(sw)} stopwords and {len(all_names)} names from NLTK.")

def run_daemon():
    # Warm up WordNet and Names
    get_names_set()
    _ = wn.synsets('entity')
    sys.stdout.write(json.dumps({'status': 'ready'}) + '\n')
    sys.stdout.flush()

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            cmd = req.get('cmd')
            if cmd == 'wordnet':
                word = req.get('word', '')
                res = get_wordnet_data(word)
                if res:
                    sys.stdout.write(json.dumps({'success': True, 'data': res}, ensure_ascii=False) + '\n')
                else:
                    sys.stdout.write(json.dumps({'success': False, 'error': 'Not found in WordNet'}) + '\n')
            elif cmd == 'is_proper':
                word = req.get('word', '')
                res = is_proper_noun(word)
                sys.stdout.write(json.dumps({'success': True, 'is_proper': res}) + '\n')
            elif cmd == 'ping':
                sys.stdout.write(json.dumps({'status': 'pong'}) + '\n')
            else:
                sys.stdout.write(json.dumps({'error': f'Unknown command {cmd}'}) + '\n')
        except Exception as e:
            sys.stdout.write(json.dumps({'error': str(e)}) + '\n')
        sys.stdout.flush()

if __name__ == '__main__':
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == '--daemon':
            run_daemon()
        elif arg == '--export':
            export_nltk_data()
        elif arg == '--proper':
            word = sys.argv[2] if len(sys.argv) > 2 else ''
            print(json.dumps({'word': word, 'is_proper': is_proper_noun(word)}))
        else:
            data = get_wordnet_data(arg)
            if data:
                print(json.dumps(data, ensure_ascii=False))
            else:
                print(json.dumps({'error': 'Not found in WordNet'}))
    else:
        print(json.dumps({'error': 'No word provided'}))
