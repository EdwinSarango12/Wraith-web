const ALLOWED_TAGS = new Set([
  'P', 'DIV', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'STRIKE',
  'H1', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'SPAN', 'BLOCKQUOTE'
])

const stripDangerousFromSpan = (el) => {
  const attrs = [...el.attributes]
  attrs.forEach((attr) => {
    const name = attr.name.toLowerCase()
    if (name === 'style') {
      const safe = attr.value
        .split(';')
        .map((s) => s.trim())
        .filter((rule) => {
          const [k] = rule.split(':').map((x) => x.trim().toLowerCase())
          return ['color', 'text-decoration', 'font-weight'].includes(k)
        })
        .join('; ')
      el.removeAttribute('style')
      if (safe) el.setAttribute('style', safe)
    } else {
      el.removeAttribute(attr.name)
    }
  })
}

const sanitizeElement = (el) => {
  const childNodes = [...el.childNodes]
  childNodes.forEach((node) => {
    if (node.nodeType !== 1) return
    if (!ALLOWED_TAGS.has(node.tagName)) {
      while (node.firstChild) el.insertBefore(node.firstChild, node)
      el.removeChild(node)
      return
    }
    if (node.tagName === 'SPAN') stripDangerousFromSpan(node)
    else [...node.attributes].forEach((a) => node.removeAttribute(a.name))
    sanitizeElement(node)
  })
}

export const sanitizeForumHtml = (html) => {
  if (!html || typeof html !== 'string') return ''
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const wrapper = doc.body.firstElementChild
  if (!wrapper) return ''
  sanitizeElement(wrapper)
  sanitizeElement(wrapper)
  return wrapper.innerHTML
}
