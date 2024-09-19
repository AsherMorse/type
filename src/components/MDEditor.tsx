import { MDXEditor, type MDXEditorMethods } from '@mdxeditor/editor';
import React, { useEffect } from 'react';
import { plugins } from 'src/utils/plugins';


function MDEditor() {
	const ref = React.useRef<MDXEditorMethods>(null)
	const fonts = [
		'serif',
		'mono',
		'sans'
	]
	const theme = [
		'light',
		'dark',
	]

	const modes = {
		font: [
			'serif',
			'mono',
			'sans'
		],
		theme: [
			'light',
			'dark',
			'sepia',
			'blue'
		]
	}
	const saveInterval = 5_000
	const allowedFiles = ['txt', 'md', 'mdx']

	const paletteSVG = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fill="currentColor" d="M12 22C10.6333 22 9.34167 21.7373 8.125 21.212C6.90833 20.6867 5.846 19.97 4.938 19.062C4.03 18.154 3.31333 17.0917 2.788 15.875C2.26267 14.6583 2 13.3667 2 12C2 10.6167 2.271 9.31667 2.813 8.1C3.355 6.88333 4.08833 5.825 5.013 4.925C5.93767 4.025 7.01667 3.31267 8.25 2.788C9.48333 2.26333 10.8 2.00067 12.2 2C13.5333 2 14.7917 2.22933 15.975 2.688C17.1583 3.14667 18.196 3.78 19.088 4.588C19.98 5.396 20.6883 6.35433 21.213 7.463C21.7377 8.57167 22 9.76733 22 11.05C22 12.9667 21.4167 14.4377 20.25 15.463C19.0833 16.4883 17.6667 17.0007 16 17H14.15C14 17 13.896 17.0417 13.838 17.125C13.78 17.2083 13.7507 17.3 13.75 17.4C13.75 17.6 13.875 17.8877 14.125 18.263C14.375 18.6383 14.5 19.0673 14.5 19.55C14.5 20.3833 14.271 21 13.813 21.4C13.355 21.8 12.7507 22 12 22ZM6.5 13C6.93333 13 7.29167 12.8583 7.575 12.575C7.85833 12.2917 8 11.9333 8 11.5C8 11.0667 7.85833 10.7083 7.575 10.425C7.29167 10.1417 6.93333 10 6.5 10C6.06667 10 5.70833 10.1417 5.425 10.425C5.14167 10.7083 5 11.0667 5 11.5C5 11.9333 5.14167 12.2917 5.425 12.575C5.70833 12.8583 6.06667 13 6.5 13ZM9.5 9C9.93333 9 10.2917 8.85833 10.575 8.575C10.8583 8.29167 11 7.93333 11 7.5C11 7.06667 10.8583 6.70833 10.575 6.425C10.2917 6.14167 9.93333 6 9.5 6C9.06667 6 8.70833 6.14167 8.425 6.425C8.14167 6.70833 8 7.06667 8 7.5C8 7.93333 8.14167 8.29167 8.425 8.575C8.70833 8.85833 9.06667 9 9.5 9ZM14.5 9C14.9333 9 15.2917 8.85833 15.575 8.575C15.8583 8.29167 16 7.93333 16 7.5C16 7.06667 15.8583 6.70833 15.575 6.425C15.2917 6.14167 14.9333 6 14.5 6C14.0667 6 13.7083 6.14167 13.425 6.425C13.1417 6.70833 13 7.06667 13 7.5C13 7.93333 13.1417 8.29167 13.425 8.575C13.7083 8.85833 14.0667 9 14.5 9ZM17.5 13C17.9333 13 18.2917 12.8583 18.575 12.575C18.8583 12.2917 19 11.9333 19 11.5C19 11.0667 18.8583 10.7083 18.575 10.425C18.2917 10.1417 17.9333 10 17.5 10C17.0667 10 16.7083 10.1417 16.425 10.425C16.1417 10.7083 16 11.0667 16 11.5C16 11.9333 16.1417 12.2917 16.425 12.575C16.7083 12.8583 17.0667 13 17.5 13ZM12 20C12.15 20 12.271 19.9583 12.363 19.875C12.455 19.7917 12.5007 19.6833 12.5 19.55C12.5 19.3167 12.375 19.0417 12.125 18.725C11.875 18.4083 11.75 17.9333 11.75 17.3C11.75 16.6 11.9917 16.0417 12.475 15.625C12.9583 15.2083 13.55 15 14.25 15H16C17.1 15 18.0417 14.6793 18.825 14.038C19.6083 13.3967 20 12.4007 20 11.05C20 9.03333 19.2293 7.354 17.688 6.012C16.1467 4.67 14.3173 3.99933 12.2 4C9.93333 4 8 4.775 6.4 6.325C4.8 7.875 4 9.76667 4 12C4 14.2167 4.77933 16.1043 6.338 17.663C7.89667 19.2217 9.784 20.0007 12 20Z" />
	</svg>

	const fontSVG = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fill="currentColor" d="M21.1923 21.6004H18.7923C18.5512 21.6141 18.3131 21.5418 18.1203 21.3964C17.9517 21.2587 17.8198 21.0814 17.7363 20.8804L16.1403 16.6444H7.86031L6.26431 20.8804C6.18256 21.0724 6.0548 21.2414 5.89231 21.3724C5.7039 21.5283 5.46471 21.6095 5.22031 21.6004H2.82031L10.4163 2.40039H13.5723L21.1923 21.6004ZM15.2883 14.4004L12.6483 7.39239C12.3933 6.71319 12.1769 6.02008 12.0003 5.31639C11.9043 5.73239 11.7963 6.13239 11.6763 6.51639C11.5563 6.90039 11.4483 7.20839 11.3523 7.44039L8.71231 14.4004H15.2883Z" />
	</svg>

	let editor: HTMLElement = null

	useEffect(() => {
		editor = document.querySelector<HTMLElement>('.editor')

		ref.current.focus()

		load()
		let saver = setInterval(() => {
			save()
		}, saveInterval)

		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				clearInterval(saver)
			} else {
				saver = setInterval(() => {
					save()
				}, saveInterval)
			}
		});

		editor.addEventListener('dragover', () => {
			editor.classList.add('dragover')
		})

		editor.addEventListener('dragleave', () => {
			editor.classList.remove('dragover')
		})

		editor.addEventListener('drop', (e) => {
			editor.classList.remove('dragover')
			console.log("File(s) dropped")

			// Prevent default behavior (Prevent file from being opened)
			e.preventDefault()
			let file: File = null
			const items = e.dataTransfer.items
			const files = e.dataTransfer.files
			if (items) {
				// Use DataTransferItemList interface to access the file(s)
				if (items.length !== 1)
					return
				if (items[0].kind !== 'file')
					return
				file = items[0].getAsFile()
			} else {
				// Use DataTransfer interface to access the file(s)
				if (files.length !== 1)
					return
				file = files[0]
			}
			const extension = file.name.split('.').pop();
			if (!allowedFiles.includes(extension))
				return

			if (ref.current.getMarkdown && !window.confirm("Overwrite current text?"))
				return

			file.text().then(t => { ref.current.setMarkdown(t) })

		})
	})

	function load() {
		const savedDoc = localStorage.getItem('doc')
		if (savedDoc) {
			ref.current.setMarkdown(savedDoc)
			console.log('Loaded saved doc')
		}
	}

	function save() {
		const doc = ref.current.getMarkdown()
		localStorage.setItem('doc', doc)
		console.log('Saved log')
	}

	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	function cycleModes(mode) {
		const modeArray = modes[mode]
		const currentValueRaw = document.documentElement.dataset[mode]
		const currentValue = currentValueRaw && currentValueRaw !== 'undefined' ? currentValueRaw : modeArray[0]
		const nextValue = modeArray[(modeArray.indexOf(currentValue) + 1) % modeArray.length]
		document.documentElement.dataset[mode] = nextValue
		localStorage.setItem(mode, nextValue)
	}

	return (
		<>
			<header><button className="export" onClick={() =>
				download('type.md', ref.current?.getMarkdown())}>
				save as file
			</button>
				<div className="customization">
					<button className="theme" onClick={(e) => cycleModes('theme')}>
						{paletteSVG}
					</button>

					<button className="font" onClick={(e) => cycleModes('font')}>
						{fontSVG}
					</button>
				</div>

			</header>
			<MDXEditor className="mdx" ref={ref} markdown={''} plugins={plugins}
				contentEditableClassName='editor' />
		</>
	)
}
export default MDEditor