import { state } from '@scripts/state'
import { deleteFromCloud } from './cloudStorage'

export async function deleteNote(noteEl: HTMLButtonElement, opfs: FileSystemDirectoryHandle, confirmed = false): Promise<boolean> {
  const noteId = noteEl.dataset.id
  const name = localStorage.getItem(`name-${noteId}`) || "note"
  console.log(`Deleting ${noteId} called ${name}`)

  const confirmation = confirmed || confirm(`Delete ${name ? `"${name}"` : `this note`}?`)
  let success = false

  if (confirmation) {
    if (state.storageMode === 'cloud' && state.isAuthenticated) {
      success = await deleteFromCloud(noteId)
    } else {
      try {
        await opfs.removeEntry(noteId)
        success = true
      } catch (error) {
        console.error('Error deleting local note:', error)
        success = false
      }
    }

    if (success) {
      if (noteEl.parentElement.parentElement.childElementCount === 1) {
        noteEl.parentElement.parentElement.remove()
      } else {
        noteEl.parentElement.remove()
      }
      localStorage.removeItem(`note-${noteId}`)
      localStorage.removeItem(`name-${noteId}`)
    }
  }
  return confirmation && success
}
