import { state } from '@scripts/state'
import { storage } from '@scripts/appwrite/storage'

export async function getNotes(opfs: FileSystemDirectoryHandle = null) {
  if (!opfs) return []

  // Get notes based on storage mode
  console.log('Getting notes with mode:', state.storageMode, 'isAuthenticated:', state.isAuthenticated)
  if (state.storageMode === 'cloud' && state.isAuthenticated) {
    return await getCloudNotes()
  } else {
    return await getLocalNotes(opfs)
  }
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
      note.name = localStorage.getItem(`name-${file.name}`) || note.content.slice(0, 50) || 'Empty note'
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

  const sessionCookie = document.cookie.split(';').find(c =>
    c.trim().startsWith('a_session_type=') ||
    c.trim().startsWith('a_session=') ||
    c.trim().startsWith('appwrite_session=') ||
    c.trim().startsWith('session=')
  )

  if (!sessionCookie) {
    console.log('No valid session cookie found')
    window.dispatchEvent(new CustomEvent('auth-state-change'))
    return []
  }

  try {
    console.log('Fetching cloud notes with cookie:', sessionCookie)
    const response = await fetch(`${import.meta.env.PUBLIC_API}/notes`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': sessionCookie.trim()
      }
    })

    if (response.status === 401) {
      console.log('Session expired or invalid, clearing auth state')
      window.dispatchEvent(new CustomEvent('auth-state-change'))
      return []
    }
    if (!response.ok) {
      console.error('Failed to fetch cloud notes:', response.statusText)
      return []
    }
    const data = await response.json()
    console.log('Raw API response:', data)
    console.log('Response headers:', Object.fromEntries([...response.headers.entries()]))

    const notes: Note[] = data.data.map(note => ({
      id: note.id,
      name: note.content.slice(0, 50) || 'Empty note',
      content: note.content,
      author: 'type.cloud',
      modified: new Date(note.lastModified)
    }))
    console.log('Processed notes:', notes)
    return notes
  } catch (error) {
    console.error('Error fetching cloud notes:', error)
    return []
  }
}
