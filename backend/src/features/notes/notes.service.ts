import { Query } from 'appwrite';
import { db, DB } from '../../utils/database';
import { Models } from 'appwrite';

interface Note {
  id: string;
  content: string;
  userId: string;
}

export class NotesService {
  static async getNotes(userId: string): Promise<Note[]> {
    console.log('Getting notes for user:', userId);
    try {
      const response = await db.list(DB.collections.notes, [
        Query.equal('userId', userId)
      ]);
      return response.documents.map((doc: Models.Document) => ({
        id: doc.$id,
        content: doc.content,
        userId: doc.userId
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  static async getNote(noteId: string, userId: string): Promise<Note | null> {
    console.log('Getting note:', noteId, 'for user:', userId);
    try {
      const note = await db.get(DB.collections.notes, noteId);
      return {
        id: note.$id,
        content: note.content,
        userId: note.userId
      };
    } catch (error) {
      console.error('Error fetching note:', error);
      return null;
    }
  }

  static async createNote(data: { content: string; userId: string }): Promise<Note> {
    console.log('Creating note for user:', data.userId);
    try {
      const document = {
        content: data.content,
        userId: data.userId,
        lastModified: new Date().toISOString()
      };
      console.log('Creating document:', document);
      const note = await db.create(DB.collections.notes, document);

      return {
        id: note.$id,
        content: note.content,
        userId: note.userId
      };
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  static async updateNote(noteId: string, data: Partial<Note>, userId: string): Promise<Note | null> {
    console.log('Updating note:', noteId, 'for user:', userId);
    try {
      const note = await db.update(DB.collections.notes, noteId, {
        content: data.content,
        lastModified: new Date().toISOString()
      });

      return {
        id: note.$id,
        content: note.content,
        userId: note.userId
      };
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  static async deleteNote(noteId: string, userId: string): Promise<boolean> {
    console.log('Deleting note:', noteId, 'for user:', userId);
    try {
      await db.delete(DB.collections.notes, noteId);
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }
} 