interface Note {
  id: string;
  content: string;
  userId: string;
}

export class NotesService {
  static async getNotes(userId: string): Promise<Note[]> {
    console.log('Getting notes for user:', userId);
    return [];
  }

  static async getNote(noteId: string, userId: string): Promise<Note | null> {
    console.log('Getting note:', noteId, 'for user:', userId);
    return null;
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