import { ID } from 'appwrite'
import { databases } from '@scripts/appwrite/client'
import { state } from '@scripts/state'

export async function saveToCloud(id: string, content: string): Promise<boolean> {
  if (!state.isAuthenticated) {
    console.log('Not authenticated, skipping cloud save')
    return false
  }

  try {
    console.log('Saving note to cloud:', id)
    // Try to update first
    try {
      await databases.updateDocument(
        'main',  // database ID
        'notes', // collection ID
        id,
        {
          content,
          lastModified: new Date().toISOString(),
          userId: state.currentUser.$id
        }
      )
      console.log('Updated existing note in cloud')
      return true
    } catch (error) {
      // If update fails (note doesn't exist), create new
      if (error.code === 404) {
        const doc = await databases.createDocument(
          'main',  // database ID
          'notes', // collection ID
          id || ID.unique(),
          {
            content,
            lastModified: new Date().toISOString(),
            userId: state.currentUser.$id
          }
        )
        console.log('Created new note in cloud:', doc.$id)
        return true
      }
      throw error // Re-throw if it's not a 404
    }
  } catch (error) {
    console.error('Error saving to cloud:', error)
    window.dispatchEvent(new CustomEvent('auth-state-change'))
    return false
  }
}

export async function deleteFromCloud(id: string): Promise<boolean> {
  if (!state.isAuthenticated) {
    console.log('Not authenticated, skipping cloud delete')
    return false
  }

  try {
    console.log('Deleting note from cloud:', id)
    await databases.deleteDocument(
      'main',  // database ID
      'notes', // collection ID
      id
    )
    console.log('Deleted note from cloud')
    return true
  } catch (error) {
    if (error.code === 404) {
      console.log('Note not found in cloud, considering delete successful')
      return true
    }
    console.error('Error deleting from cloud:', error)
    window.dispatchEvent(new CustomEvent('auth-state-change'))
    return false
  }
} 