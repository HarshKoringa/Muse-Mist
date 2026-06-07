export function scrollToProducts() {
  const el = document.getElementById('products')
  if (!el) {
    window.location.href = '/#products'
    return
  }
  const top = el.getBoundingClientRect().top + window.scrollY - 80
  try {
    window.scrollTo({ top, behavior: 'smooth' })
  } catch {
    window.scrollTo(0, top)
  }
  // Double-check after 400ms — Android Chrome sometimes ignores the first scroll
  setTimeout(() => {
    const el2 = document.getElementById('products')
    if (el2) {
      const targetPos = el2.getBoundingClientRect().top + window.scrollY - 80
      if (Math.abs(window.scrollY - targetPos) > 100) {
        window.scrollTo(0, targetPos)
      }
    }
  }, 400)
}
