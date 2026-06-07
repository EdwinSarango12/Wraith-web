const LS_KEY = 'wraith-noticias-forum-posts-v1'
const BC_NAME = 'wraith-noticias-forum'

const DB_NAME = 'wraithNoticiasForum'
const DB_VERSION = 1
const STORE_POSTS = 'posts'

const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(BC_NAME) : null

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer)
  const chunk = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunk) {
    const sub = bytes.subarray(i, Math.min(i + chunk, bytes.length))
    binary += String.fromCharCode.apply(null, sub)
  }
  return btoa(binary)
}

const openLegacyIdb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_POSTS)) {
        db.createObjectStore(STORE_POSTS, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const getAllFromIdb = async () => {
  const db = await openLegacyIdb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_POSTS, 'readonly')
    const q = tx.objectStore(STORE_POSTS).getAll()
    q.onsuccess = () => resolve(q.result || [])
    q.onerror = () => reject(q.error)
  })
}

const clearIdbPosts = async () => {
  try {
    const db = await openLegacyIdb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_POSTS, 'readwrite')
      tx.objectStore(STORE_POSTS).clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } catch {
    /* noop */
  }
}

const serializePost = (post) => ({
  id: post.id,
  createdAt: post.createdAt,
  htmlBody: post.htmlBody,
  attachments: (post.attachments || []).map((a) => {
    if (a.dataBase64) return { mimeType: a.mimeType, dataBase64: a.dataBase64 }
    if (a.buffer) {
      return { mimeType: a.mimeType, dataBase64: arrayBufferToBase64(a.buffer) }
    }
    return null
  }).filter(Boolean)
})

const parseLs = () => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const posts = JSON.parse(raw)
    return Array.isArray(posts) ? posts : []
  } catch {
    return []
  }
}

let migrationAttempted = false

const migrateFromIndexedDbIfNeeded = async () => {
  if (migrationAttempted) return
  migrationAttempted = true
  if (parseLs().length > 0) return
  try {
    const legacy = await getAllFromIdb()
    if (!legacy.length) return
    const serialized = legacy.map(serializePost)
    localStorage.setItem(LS_KEY, JSON.stringify(serialized))
    await clearIdbPosts()
  } catch {
    migrationAttempted = false
  }
}

export const broadcastForumUpdate = () => {
  bc?.postMessage({ type: 'forum-update' })
  try {
    localStorage.setItem('wraith-forum-bump', String(Date.now()))
  } catch {
    /* noop */
  }
}

export const subscribeForumUpdates = (handler) => {
  const run = () => handler()
  if (bc) {
    bc.onmessage = run
  }
  const onStorage = (e) => {
    if (e.key === LS_KEY || e.key === 'wraith-noticias-forum-reactions' || e.key === 'wraith-forum-bump') run()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    if (bc) bc.onmessage = null
    window.removeEventListener('storage', onStorage)
  }
}

export const getAllForumPosts = async () => {
  await migrateFromIndexedDbIfNeeded()
  const rows = parseLs()
  return rows.sort((a, b) => b.createdAt - a.createdAt)
}

export const putForumPost = async (post) => {
  await migrateFromIndexedDbIfNeeded()
  const entry = serializePost(post)
  const existing = parseLs().filter((p) => p.id !== entry.id)
  const next = [entry, ...existing]
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  } catch (e) {
    console.error(e)
    throw new Error('STORAGE_FULL')
  }
  broadcastForumUpdate()
}

export const deleteForumPost = async (id) => {
  await migrateFromIndexedDbIfNeeded()
  const next = parseLs().filter((p) => p.id !== id)
  localStorage.setItem(LS_KEY, JSON.stringify(next))
  broadcastForumUpdate()
}

const REACTIONS_KEY = 'wraith-noticias-forum-reactions'

export const loadForumReactions = () => {
  try {
    const raw = localStorage.getItem(REACTIONS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export const saveForumReactions = (map) => {
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(map))
}

export const getVoterKey = (user) => {
  if (user?.id != null) return `u:${user.id}`
  let anon = localStorage.getItem('wraith-forum-anon-voter')
  if (!anon) {
    anon = `anon:${crypto.randomUUID()}`
    localStorage.setItem('wraith-forum-anon-voter', anon)
  }
  return anon
}
