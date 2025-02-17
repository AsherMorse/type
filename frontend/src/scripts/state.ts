import type { Editor } from '@milkdown/kit/core';
import type { Editor as Editor2 } from '@tiptap/core'
import type { Models } from 'appwrite';

import { getOpfs } from '@scripts/storage/getOpfs';
import { getNotes } from '@scripts/storage/getNotes';
import { getByTag } from '@scripts/utils/getElements';
import { getEditorVersion } from '@scripts/utils/getEditorVersion';

export const state = {
  // Editor
  editor: null as Editor,						// Global editor object
  editor2: null as Editor2,					// Global editor 2 object
  locked: false,								// UI is locked (view-only)	
  empty: true,								// Editor is empty
  wasEmpty: true,								// Did not finish transition from empty state
  updated: false,								// Editor (current note) has changed
  editorVersion: '1',

  // Storage
  opfs: null as FileSystemDirectoryHandle,	// Entry for origin-private file system
  notes: [] as Note[],						// All the loaded notes
  hasNotes: true,								// Number of notes is not 0

  // Elements
  mainEl: null as HTMLElement,				// Editor + Notes (w/o header)
  editorEl: null as HTMLElement,				// Lowest-level editor container

  // Auth
  isAuthenticated: false,						// User is logged in
  currentUser: null as Models.User<Models.Preferences> | null,	// Current user data
}

export async function initState() {
  state.locked = false
  state.empty = true
  state.updated = false
  state.editorVersion = getEditorVersion()

  state.opfs = await getOpfs()
  state.notes = await getNotes(state.opfs)
  state.hasNotes = state.notes?.length > 0

  state.mainEl = getByTag('main')
}