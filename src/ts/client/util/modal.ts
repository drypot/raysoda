export const MODAL_OK = 'ok'
export const MODAL_CANCEL = 'cancel'

export type ModalCallback = ((result: string) => void) | (() => void)

const bg = document.getElementById("modal-bg") as HTMLElement
const dlg = document.getElementById("modal-dialog") as HTMLElement
const titleEl = document.getElementById("modal-title") as HTMLElement
const messageEl = document.getElementById("modal-message") as HTMLElement
const cancelBtn = document.getElementById("modal-cancel-btn") as HTMLElement
const okBtn = document.getElementById("modal-ok-btn") as HTMLElement

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

cancelBtn.onclick = () => {
  closeModal(MODAL_CANCEL)
}

okBtn.onclick = () => {
  closeModal(MODAL_OK)
}

export function openBlueModal(title: string, text: string, btn:string, handler?: ModalCallback) {
  showElement(cancelBtn)
  okBtn.innerText = btn
  okBtn.className = 'btn-blue'
  messageEl.className = 'text-center'
  openModal(title, text, handler)
}

export function openRedModal(title: string, text: string, btn:string, handler?: ModalCallback) {
  showElement(cancelBtn)
  okBtn.innerText = btn
  okBtn.className = 'btn-red'
  messageEl.className = 'text-center'
  openModal(title, text, handler)
}

export function openErrorModal(err: any, handler?: ModalCallback) {
  hideElement(cancelBtn)
  okBtn.innerText = '확인'
  okBtn.className = 'btn-blue'
  messageEl.className = 'code-dump text-left'
  openModal(err.name, err.message, handler)
}

function openModal(title: string, text: string, handler?: ModalCallback) {
  handlerSave = handler
  titleEl.textContent = title
  messageEl.textContent = text
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
