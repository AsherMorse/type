import { state } from '@scripts/state'
import { storage } from '@scripts/appwrite/storage'
import { client } from '@scripts/appwrite/client'
import { databases } from '@scripts/appwrite/client'
import { Query } from 'appwrite'

export async function getNotes(opfs: FileSystemDirectoryHandle = null) {
  if (!opfs) return []

  // Get notes based on storage mode
  console.log('Getting notes with mode:', state.storageMode, 'isAuthenticated:', state.isAuthenticated)
  let notes = []
  if (state.storageMode === 'cloud' && state.isAuthenticated) {
    notes = await getCloudNotes()
  } else {
    notes = await getLocalNotes(opfs)
  }

  // Filter notes by current user if in cloud mode
  if (state.storageMode === 'cloud' && state.isAuthenticated) {
    notes = notes.filter(note => note.userId === state.currentUser.$id)
  }

  return notes
}

export async function getLocalNotes(opfs: FileSystemDirectoryHandle) {
  const notes: Note[] = []
  for await (const handle of opfs.values()) {
    if (handle.kind === 'file') {
      const file = await (handle as FileSystemFileHandle).getFile() as File
      const note: Note = {
        id: file.name,
        name: null,
        author: 'type.local',
        modified: new Date(file.lastModified)
      }

      note.content = await file.text()
      const firstLine = note.content.split('\n')[0].trim()
      note.name = localStorage.getItem(`name-${file.name}`) || firstLine || 'Empty note'
      notes.push(note)
    }
  }
  console.log('Local notes:', notes)
  return notes
}

async function getCloudNotes() {
  if (!state.isAuthenticated) {
    console.log('Not authenticated, skipping cloud notes fetch')
    return []
  }

  try {
    console.log('Fetching cloud notes using Appwrite client')
    const response = await databases.listDocuments(
      'main',  // database ID
      'notes', // collection ID
      []  // No filters at database level
    )

    console.log('Raw API response:', response)

    const notes: Note[] = response.documents.map(doc => ({
      id: doc.$id,
      name: doc.content.split('\n')[0].trim() || 'Empty note',
      content: doc.content,
      author: 'type.cloud',
      modified: new Date(doc.lastModified),
      userId: doc.userId  // Make sure to include userId in the note object
    }))
    console.log('Processed notes:', notes)
    return notes
  } catch (error) {
    console.error('Error fetching cloud notes:', error)
    window.dispatchEvent(new CustomEvent('auth-state-change'))
    return []
  }
}
