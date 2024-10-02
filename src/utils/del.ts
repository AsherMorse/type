export function del(noteId: string, opfs: FileSystemDirectoryHandle) {
	const name = localStorage.getItem(`note-${noteId}`)
	const confirmation = confirm(`Delete ${name? name: "note"}?`)
	if (confirmation){
	    opfs.removeEntry(noteId)
		localStorage.removeItem(`note-${noteId}`)
	    location.reload()
	}

	return confirmation
}
