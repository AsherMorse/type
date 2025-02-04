import { Editor } from '@milkdown/core'
import { getMarkdown } from '@milkdown/utils'
import { isEmptyString } from '@scripts/utils/isEmptyString'
import { showState } from '@scripts/render/showState'
import { smartTrunc } from '@scripts/utils/smartTrunc'

export type SaveRef = 'autosave' | 'shortcut' | 'unload' | 'clear' | 'overwrite' | 'multiple-drop' | 'publish' | 'copy'

export async function writeToFile(editor: Editor, editorEl: HTMLElement, opfs: FileSystemDirectoryHandle, id: string, stateEl: HTMLElement, saveRef: SaveRef = 'autosave', hidden = false, markdown: string = editor.action(getMarkdown()) || '') {
	markdown = markdown.replace(/&#x20;/g, ' ')

	if (isEmptyString(markdown)) {
		console.debug(`Note is empty`)
		return false
	}

	const defaultLength = 80
	const firstBlock = (editorEl.children[0] as HTMLElement).innerText
	const name = smartTrunc(isEmptyString(firstBlock) ? markdown.split('\n')[0] : firstBlock, defaultLength)

	console.debug(`Saving "${name}" by ${saveRef}`)

	const savedNote: Note = {
		id: id,
		name: name,
		author: 'type.local',
		modified: null,
	}
	localStorage.setItem(`name-${id}`, name)

	// Write to file
	try {
		const handle = await opfs.getFileHandle(id, { create: true, })
		const file = await handle.getFile()
		savedNote.modified = new Date(file.lastModified)
		const writable = await handle.createWritable()
		await writable.write(markdown)
		await writable.close()
	}
	catch {
		let worker = new Worker('./safari.js')

		worker.postMessage({
			ref: 'save',
			fileName: id,
			content: markdown
		})
	}

	if (!hidden) {
		switch (saveRef) {
			case 'multiple-drop': break
			case 'copy': showState(stateEl, 'note copied'); break
			case 'overwrite': showState(stateEl, 'previous note saved'); break
			default: showState(stateEl, 'saved')
		}
	}

	return Date.now()
}