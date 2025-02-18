import { state } from '@scripts/state'
import { deleteFromCloud } from './cloudStorage'
import { updateNotesList } from '@scripts/render/notes'

export async function deleteNote(noteEl: HTMLButtonElement, opfs: FileSystemDirectoryHandle, confirmed = true): Promise<boolean> {
  const noteId = noteEl.dataset.id
  const name = localStorage.getItem(`name-${noteId}`) || "note"
  console.log(`Deleting ${noteId} called ${name}`)

  let success = false

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
    const parent = noteEl.parentElement;
    const grandParent = parent?.parentElement;

    if (grandParent && parent && grandParent.childElementCount === 1) {
      grandParent.remove();
    } else if (parent) {
      parent.remove();
    }
    localStorage.removeItem(`note-${noteId}`);
    localStorage.removeItem(`name-${noteId}`);
    await updateNotesList();
  }
  return success
}
