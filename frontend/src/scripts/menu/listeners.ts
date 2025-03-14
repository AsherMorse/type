import { menu } from '@scripts/menu/elements'
import { exportAll, exportFile } from '@scripts/note/export'
import { unlock } from '@scripts/editor/lock'
import { publish } from '@scripts/note/publish'
import { save } from '@scripts/note/save'
import { currentAppearance, cycleAppearance } from '@scripts/render/appearance';
import { state } from '@scripts/state';
import { loadCurrentId } from '@scripts/utils/currentNote';
import { showStatus } from '@scripts/render/showStatus';
import { auth } from '@scripts/appwrite/auth';

declare global {
  interface Window {
    showSuccess: (message: string, duration?: number) => void;
  }
}

export function initMenuListeners() {
  console.debug('Assigning menu listeners');

  // Open menu
  menu.showMenuEl.addEventListener('click', () => {
    menu.showMenuEl.classList.toggle('active');
  });
  // Hide menu on outside click
  document.documentElement.addEventListener('click', (e: MouseEvent) => {
    if (
      !menu.dropdownEl.contains(e.target as Node) &&
      !menu.showMenuEl.contains(e.target as Node)
    )
      menu.showMenuEl.classList.remove('active')
  })
  // Publish note
  menu.publishEl.addEventListener('click', () => {
    if (state.empty) return
    save('publish', true)
    menu.showMenuEl.classList.remove('active')
    publish(loadCurrentId())
  })
  // Download note as file
  menu.downloadEl.addEventListener('click', () => {
    if (state.empty) return
    menu.showMenuEl.classList.remove('active')
    exportFile()
  })
  // Download all notes as archive
  menu.exportAllEl.addEventListener('click', () => {
    menu.showMenuEl.classList.remove('active')
    exportAll()
  })
  // Duplicate to local notes and unlock
  menu.copyAndEditEl.addEventListener('click', () => {
    menu.showMenuEl.classList.remove('active')
    unlock()
    save('copy')
  })

  // Set actual values
  menu.fontValueEl.textContent = currentAppearance('font')
  menu.themeValueEl.textContent = currentAppearance('theme')
  menu.spellValueEl.textContent = state.editorEl.spellcheck ? 'on' : 'off'
  menu.storageValueEl.textContent = state.storageMode

  // Change font
  menu.fontEl.addEventListener('click', () => {
    menu.fontValueEl.textContent = cycleAppearance('font')
  })
  // Change theme
  menu.themeEl.addEventListener('click', () => {
    menu.themeValueEl.textContent = cycleAppearance('theme')
  })
  // Change spellcheck
  menu.spellEl.addEventListener('click', () => {
    state.editorEl.spellcheck = !state.editorEl.spellcheck
    menu.spellValueEl.textContent = state.editorEl.spellcheck ? 'on' : 'off'
    localStorage.setItem('spell', state.editorEl.spellcheck.toString())
  })

  // Login
  menu.loginEl.addEventListener('click', () => {
    menu.showMenuEl.classList.remove('active')
  })

  // Register
  menu.registerEl.addEventListener('click', () => {
    menu.showMenuEl.classList.remove('active')
  })

  // Logout
  const logoutButton = document.querySelector(".logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        const success = await auth.logout();
        if (success) {
          window.showSuccess("Successfully logged out!");
          // Close any open modals
          const dropdowns = document.querySelectorAll(".menu-dropdown");
          dropdowns.forEach((dropdown) => {
            if (dropdown.classList.contains("is-active")) {
              dropdown.classList.remove("is-active");
            }
          });
          // Refresh the page to reset the app state
          window.location.reload();
        } else {
          console.error("Logout failed");
          window.showSuccess("Failed to log out", 2000);
        }
      } catch (error) {
        console.error("Logout error:", error);
        window.showSuccess("Failed to log out", 2000);
      }
    });
  }

  // Storage toggle
  menu.storageToggleEl.addEventListener('click', () => {
    const newMode = state.storageMode === 'local' ? 'cloud' : 'local'
    state.storageMode = newMode
    localStorage.setItem('storage-mode', newMode)
    menu.storageValueEl.textContent = newMode
    window.showSuccess(`Switched to ${newMode} storage`)
    menu.showMenuEl.classList.remove('active')
    window.location.reload()
  })
}
