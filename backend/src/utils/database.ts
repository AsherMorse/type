import { ID } from 'appwrite';
import { databases } from './client';

// Database and collection IDs
export const DB = {
  id: 'type',
  collections: {
    notes: 'notes'
  }
};

// Helper functions for database operations
export const db = {
  // Create a document
  create: async <T extends object>(
    collectionId: string,
    data: T,
    id?: string
  ) => {
    return await databases.createDocument(
      DB.id,
      collectionId,
      id || ID.unique(),
      data
    );
  },

  // Get a document
  get: async (collectionId: string, id: string) => {
    return await databases.getDocument(
      DB.id,
      collectionId,
      id
    );
  },

  // List documents with query
  list: async (
    collectionId: string,
    queries?: string[]
  ) => {
    return await databases.listDocuments(
      DB.id,
      collectionId,
      queries
    );
  },

  // Update a document
  update: async <T extends object>(
    collectionId: string,
    id: string,
    data: T
  ) => {
    return await databases.updateDocument(
      DB.id,
      collectionId,
      id,
      data
    );
  },

  // Delete a document
  delete: async (collectionId: string, id: string) => {
    return await databases.deleteDocument(
      DB.id,
      collectionId,
      id
    );
  }
}; 