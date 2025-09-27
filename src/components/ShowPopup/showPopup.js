import './showPopup.css'

export function showPopup(message) {
  const popup = document.createElement('div')
  popup.className = 'popup-message'
  popup.textContent = message
  document.body.appendChild(popup)
  setTimeout(() => popup.remove(), 2500)
}
