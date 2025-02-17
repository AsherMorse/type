import { Router } from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from './notes.controller';

const router = Router();

// Get all notes for the authenticated user
router.get('/', getNotes);

// Get a specific note
router.get('/:id', getNote);

// Create a new note
router.post('/', createNote);

// Update a note
router.put('/:id', updateNote);

// Delete a note
router.delete('/:id', deleteNote);

export default router; 