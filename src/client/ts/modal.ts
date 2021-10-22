export const MODAL_OK = 'ok'
export const MODAL_CANCEL = 'cancel'
export const MODAL_INFO = 'info'
export const MODAL_DELETE = 'delete'

export type ModalCallback = (result: string) => {}

const bg = document.getElementById("modal-bg") as HTMLElement
const dlg = document.getElementById("modal-dialog") as HTMLElement
const titleEl = dlg.querySelector('h2') as HTMLElement
const textEl = dlg.querySelector('p') as HTMLElement
const grayBtn = document.getElementById("modal-gray-btn") as HTMLElement
const greenBtn = document.getElementById("modal-green-btn") as HTMLElement
const blueBtn = document.getElementById("modal-blue-btn") as HTMLElement
const redBtn = document.getElementById("modal-red-btn") as HTMLElement

let handlerSave: ModalCallback | undefined

window.addEventListener('click', (e) => {
  if (e.target === bg) {
    closeModal(MODAL_CANCEL)
  }
})

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (bg.style.display === 'block') {
      closeModal(MODAL_CANCEL)
      e.preventDefault();
    }
  }
})

grayBtn.onclick = () => {
  closeModal(MODAL_CANCEL)
}

greenBtn.onclick = () => {
  closeModal(MODAL_INFO)
}

blueBtn.onclick = () => {
  closeModal(MODAL_OK)
}

redBtn.onclick = () => {
  closeModal(MODAL_DELETE)
}

export function openOkModal(title: string, text: string, handler: ModalCallback) {
  hideAllButtons()
  showElement(blueBtn)
  showModal(title, text, handler)
}

export function openDeleteModal(title: string, text: string, handler: ModalCallback) {
  hideAllButtons()
  showElement(grayBtn)
  showElement(redBtn)
  showModal(title, text, handler)
}

function hideAllButtons() {
  const btnList = dlg.querySelectorAll('button')
  for (const btn of btnList) {
    hideElement(btn)
  }
}

function showModal(title: string, text: string, handler: ModalCallback) {
  handlerSave = handler
  titleEl.textContent = title
  textEl.textContent = text
  showElement(bg)
}

function closeModal(result: string) {
  hideElement(bg)
  if (handlerSave) {
    handlerSave(result)
  }
}

function showElement(e: HTMLElement) {
  e.style.display = 'block'
}

function hideElement(e: HTMLElement) {
  e.style.display = 'none'
}
