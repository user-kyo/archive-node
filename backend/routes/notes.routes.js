const express = require('express');
const prisma = require('../config/db');

const router = express.Router();

// Helper: parse terms from JSON string
function formatNote(note) {
  let terms = [];
  try {
    terms = typeof note.terms === 'string' ? JSON.parse(note.terms) : (note.terms || []);
  } catch (e) {
    terms = [];
  }
  return {
    ...note,
    terms,
    searchStr: (note.title + ' ' + terms.join(' ') + ' ' + note.text).toLowerCase()
  };
}

// GET /api/notes - Retrieve all notes
router.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(notes.map(formatNote));
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

// GET /api/notes/:id - Retrieve a specific note
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(formatNote(note));
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, text, date, terms } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Note text is required' });
    }

    const termsStr = Array.isArray(terms) ? JSON.stringify(terms) : '[]';
    const note = await prisma.note.create({
      data: {
        title: (title && title.trim()) || 'Untitled note',
        text: text.trim(),
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        terms: termsStr
      }
    });

    res.status(201).json(formatNote(note));
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id - Update an existing note
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    const { title, text, date, terms } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim() || 'Untitled note';
    if (text !== undefined) updateData.text = text.trim();
    if (date !== undefined) updateData.date = date;
    if (terms !== undefined) {
      updateData.terms = Array.isArray(terms) ? JSON.stringify(terms) : '[]';
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: updateData
    });

    res.json(formatNote(updatedNote));
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id - Delete a specific note
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    await prisma.note.delete({
      where: { id }
    });

    res.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// DELETE /api/notes - Clear all notes (Protected by confirmation guard)
router.delete('/', async (req, res) => {
  try {
    const isConfirmed = req.query.confirm === 'true' || req.headers['x-confirm-clear'] === 'true';
    if (!isConfirmed) {
      return res.status(400).json({
        error: 'Bulk deletion requires explicit confirmation. Pass ?confirm=true or Header "X-Confirm-Clear: true"'
      });
    }

    const result = await prisma.note.deleteMany();
    res.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Error clearing notes:', error);
    res.status(500).json({ error: 'Failed to clear notes' });
  }
});

module.exports = router;
