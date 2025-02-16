export function handleFormSubmit(e: SubmitEvent, action: string) {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const data = new FormData(form)
  console.debug(`${action} attempted with data:`, Object.fromEntries(data))
} 