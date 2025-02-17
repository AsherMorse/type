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
    return {
      id: 'stub-id',
      content: data.content,
      userId: data.userId
    };
  }

  static async updateNote(noteId: string, data: Partial<Note>, userId: string): Promise<Note | null> {
    console.log('Updating note:', noteId, 'for user:', userId);
    return null;
  }

  static async deleteNote(noteId: string, userId: string): Promise<boolean> {
    console.log('Deleting note:', noteId, 'for user:', userId);
    return true;
  }
} 