import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import API_BASE_URL, { ENDPOINTS } from '../config/api'

const JSON_ALIASES = import.meta.env.VITE_NOTICIAS_JSON_ALIASES === 'true'

const getBearer = () => {
  try {
    const raw = localStorage.getItem('auth-token')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

const getAdministradorIdFromToken = () => {
  const token = getBearer()
  if (!token) return null
  try {
    const d = jwtDecode(token)
    return d.id ?? d._id ?? d.idAdministrador ?? d.idAdmin ?? d.userId ?? null
  } catch {
    return null
  }
}

const getRolFromToken = () => {
  const token = getBearer()
  if (!token) return null
  try {
    const decoded = jwtDecode(token)
    const fromJwt = decoded?.rol
    if (fromJwt) return String(fromJwt).toLowerCase()
  } catch {
    /* noop */
  }
  try {
    const raw = localStorage.getItem('auth-token')
    const fromStore = JSON.parse(raw)?.state?.rol
    if (fromStore) return String(fromStore).toLowerCase()
  } catch {
    /* noop */
  }
  return null
}

const extractArray = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.publicaciones)) return data.publicaciones
  if (Array.isArray(data?.noticias)) return data.noticias
  if (Array.isArray(data?.data)) return data.data
  return []
}

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const collectMediaUrls = (item) => {
  const out = []
  const push = (u) => {
    if (u && typeof u === 'string' && /^https?:\/\//i.test(u)) out.push(u)
  }
  push(item.urlImagen)
  push(item.imagenUrl)
  push(item.videoUrl)
  push(item.multimediaUrl)
  push(item.archivoUrl)
  if (typeof item.imagen === 'string') push(item.imagen)
  if (typeof item.video === 'string') push(item.video)
  if (Array.isArray(item.imagenes)) item.imagenes.forEach(push)
  if (Array.isArray(item.archivos)) item.archivos.forEach((a) => (typeof a === 'string' ? push(a) : push(a?.url)))
  if (Array.isArray(item.adjuntos)) item.adjuntos.forEach((a) => (typeof a === 'string' ? push(a) : push(a?.url)))
  return [...new Set(out)]
}

const parseCreatedAt = (item) => {
  const v =
    item.fechaCreacion ??
    item.fecha ??
    item.createdAt ??
    item.date ??
    item.fechaPublicacion ??
    item._created
  if (v == null) return Date.now()
  const t = new Date(v).getTime()
  return Number.isNaN(t) ? Date.now() : t
}

const mapItemToPost = (item) => {
  const id = String(item._id ?? item.id ?? '')
  const titulo = item.titulo ?? item.title ?? ''
  let htmlBody =
    item.informacion ??
    item.contenido ??
    item.mensaje ??
    item.cuerpo ??
    item.descripcion ??
    item.html ??
    ''
  if (titulo && htmlBody && !htmlBody.includes(String(titulo).slice(0, 20))) {
    htmlBody = `<h2>${escapeHtml(titulo)}</h2>${htmlBody}`
  } else if (titulo && !htmlBody) {
    htmlBody = `<h2>${escapeHtml(titulo)}</h2><p></p>`
  }
  return {
    id,
    titulo: titulo || null,
    createdAt: parseCreatedAt(item),
    htmlBody,
    attachments: [],
    serverMediaUrls: collectMediaUrls(item)
  }
}

const getListOnce = async (path) => {
  const token = getBearer()
  if (!token) return []
  const url = `${API_BASE_URL}${path}`
  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return extractArray(data).map(mapItemToPost).filter((p) => p.id)
}

const listPathsForRol = () => {
  const rol = getRolFromToken()
  const admin = ENDPOINTS.noticias.listarAdmin
  const jugador = ENDPOINTS.noticias.listarJugador
  if (rol === 'administrador') return [admin, jugador]
  if (rol === 'jugador') return [jugador, admin]
  return [admin, jugador]
}

export const fetchPublicacionesDesdeApi = async () => {
  if (!getBearer()) return []

  const paths = listPathsForRol()
  let lastErr = null
  for (const path of paths) {
    try {
      return await getListOnce(path)
    } catch (e) {
      lastErr = e
      const status = e?.response?.status
      if (status === 404 || status === 403) continue
      throw e
    }
  }
  if (lastErr) {
    console.warn('noticias listar:', lastErr?.response?.data ?? lastErr.message)
  }
  return []
}

const shouldAttachAdministradorId = (id) => {
  if (id == null || id === '') return false
  const s = String(id)
  if (s.includes('@')) return false
  return /^[a-f\d]{24}$/i.test(s) || /^\d+$/.test(s) || /^[0-9a-f-]{36}$/i.test(s)
}

const includeAdminIdInJson =
  import.meta.env.VITE_NOTICIAS_JSON_INCLUDE_ADMIN_ID === 'true'

const buildPublicarBody = (titulo, informacion) => {
  const body = { titulo, informacion }
  const adminId = getAdministradorIdFromToken()
  if (includeAdminIdInJson && shouldAttachAdministradorId(adminId)) {
    body.idAdministrador = adminId
  }
  if (JSON_ALIASES) {
    body.descripcion = informacion
    body.mensaje = informacion
  }
  return body
}

const postMultipartPublicar = (titulo, informacion, files) => {
  const token = getBearer()
  if (!token) throw new Error('NO_AUTH')
  const url = `${API_BASE_URL}${ENDPOINTS.noticias.publicar}`
  const tk = ENDPOINTS.noticias.mpTitulo
  const ik = ENDPOINTS.noticias.mpInformacion
  const ak = ENDPOINTS.noticias.mpArchivos
  const adminId = getAdministradorIdFromToken()

  const fd = new FormData()
  fd.append(tk, titulo)
  fd.append(ik, informacion)
  if (JSON_ALIASES) {
    fd.append('descripcion', informacion)
    fd.append('mensaje', informacion)
  }
  if (includeAdminIdInJson && shouldAttachAdministradorId(adminId)) {
    fd.append('idAdministrador', String(adminId))
  }
  files.forEach((file) => {
    if (file instanceof File) {
      fd.append(ak, file, file.name)
    }
  })
  return axios.post(url, fd, {
    headers: { Authorization: `Bearer ${token}` },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })
}

const postJsonPublicar = (titulo, informacion) => {
  const token = getBearer()
  if (!token) throw new Error('NO_AUTH')
  const url = `${API_BASE_URL}${ENDPOINTS.noticias.publicar}`
  return axios.post(url, buildPublicarBody(titulo, informacion), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}

const stripHtmlToPlain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * POST /administrador/publicar — JSON exacto: { titulo, informacion }.
 * Con archivos: multipart con las mismas claves (titulo, informacion) + archivos.
 */
export const publicarNoticiaEnApi = async ({ titulo, contenido, files = [] }) => {
  if (!getBearer()) throw new Error('NO_AUTH')

  const hasFiles = files.length > 0

  if (!hasFiles) {
    try {
      const { data } = await postJsonPublicar(titulo, contenido)
      return data
    } catch (e1) {
      const st1 = e1?.response?.status
      if (st1 === 415 || st1 === 400) {
        const { data } = await postMultipartPublicar(titulo, contenido, [])
        return data
      }
      if (st1 === 500 && /<[^>]+>/.test(contenido)) {
        try {
          const plain = stripHtmlToPlain(contenido)
          const { data } = await postJsonPublicar(titulo, plain || titulo)
          return data
        } catch {
          throw e1
        }
      }
      throw e1
    }
  }

  try {
    const { data } = await postMultipartPublicar(titulo, contenido, files)
    return data
  } catch (eM) {
    const st = eM?.response?.status
    if (st === 415 || st === 400) {
      const { data } = await postJsonPublicar(titulo, contenido)
      return data
    }
    if (st === 500 && /<[^>]+>/.test(contenido)) {
      try {
        const plain = stripHtmlToPlain(contenido)
        const { data } = await postMultipartPublicar(titulo, plain || titulo, files)
        return data
      } catch {
        throw eM
      }
    }
    throw eM
  }
}

export const eliminarNoticiaEnApi = async (id) => {
  const token = getBearer()
  if (!token) throw new Error('NO_AUTH')
  const path = ENDPOINTS.noticias.eliminar(id)
  const url = `${API_BASE_URL}${path}`
  await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const bufferToFile = (buffer, mimeType, filename) => {
  const blob = new Blob([buffer], { type: mimeType || 'application/octet-stream' })
  return new File([blob], filename || 'adjunto', { type: mimeType || 'application/octet-stream' })
}
