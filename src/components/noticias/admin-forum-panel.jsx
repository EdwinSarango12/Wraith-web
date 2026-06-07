import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { FaThumbsDown, FaThumbsUp, FaTrash } from 'react-icons/fa'
import storeProfile from '../../context/storeProfile'
import storeAuth from '../../context/storeAuth'
import { sanitizeForumHtml } from './forum-sanitize'
import {
  broadcastForumUpdate,
  getVoterKey,
  loadForumReactions,
  saveForumReactions,
  subscribeForumUpdates
} from './forum-db'
import {
  bufferToFile,
  eliminarNoticiaEnApi,
  fetchPublicacionesDesdeApi,
  publicarNoticiaEnApi
} from '../../services/noticias-api'
import { ConfirmDeleteNoticiaModal } from './confirm-delete-noticia-modal'
import { GlareHoverButton } from './glare-hover-button'

const EMOJI_ROW = ['😀', '🔥', '⚔️', '🛡️', '💀', '✨', '❤️', '👍', '👎', '🎮', '🏆', '⭐', '📢', '💬', '🧙', '🐉']

const IMAGE_MAX = 12 * 1024 * 1024
const VIDEO_MAX = 45 * 1024 * 1024

const exec = (command, value = null) => {
  try {
    document.execCommand(command, false, value)
  } catch {
    /* noop */
  }
}

const formatDate = (ts) =>
  new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(ts)

const emptyReactions = () => ({ likes: 0, dislikes: 0, voters: {} })

const applyVoteChange = (block, voterKey, nextChoice) => {
  const voters = { ...block.voters }
  const prev = voters[voterKey]
  let { likes, dislikes } = block

  if (prev === nextChoice) {
    delete voters[voterKey]
    if (nextChoice === 'like') likes = Math.max(0, likes - 1)
    else dislikes = Math.max(0, dislikes - 1)
  } else if (!prev) {
    voters[voterKey] = nextChoice
    if (nextChoice === 'like') likes += 1
    else dislikes += 1
  } else {
    voters[voterKey] = nextChoice
    if (prev === 'like') {
      likes = Math.max(0, likes - 1)
      dislikes += 1
    } else {
      dislikes = Math.max(0, dislikes - 1)
      likes += 1
    }
  }
  return { likes, dislikes, voters }
}

const isVideoUrl = (src) => /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(src)

const blobUrlsFromPost = (post) => {
  const urls = []
  if (!post.attachments?.length) return urls
  post.attachments.forEach((att) => {
    try {
      if (att.dataBase64) {
        const binary = atob(att.dataBase64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
        const blob = new Blob([bytes], { type: att.mimeType || 'application/octet-stream' })
        urls.push(URL.createObjectURL(blob))
        return
      }
      if (att.buffer instanceof ArrayBuffer) {
        const blob = new Blob([att.buffer], { type: att.mimeType || 'application/octet-stream' })
        urls.push(URL.createObjectURL(blob))
      }
    } catch {
      /* noop */
    }
  })
  return urls
}

export const AdminForumPanel = ({ isAdmin }) => {
  const user = storeProfile((s) => s.user)
  const authToken = storeAuth((s) => s.token)
  const editorRef = useRef(null)
  const fileInputRef = useRef(null)
  const [posts, setPosts] = useState([])
  const [reactions, setReactions] = useState({})
  const [attachmentDrafts, setAttachmentDrafts] = useState([])
  const [blobRegistry, setBlobRegistry] = useState({})
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false)

  const voterKey = useMemo(() => getVoterKey(user), [user])

  const revokePostUrls = useCallback((postId) => {
    setBlobRegistry((prev) => {
      const list = prev[postId]
      if (list?.length) list.forEach((u) => URL.revokeObjectURL(u))
      const { [postId]: _, ...rest } = prev
      return rest
    })
  }, [])

  const refreshPosts = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchPublicacionesDesdeApi()
      setPosts(list)
      setBlobRegistry((prev) => {
        Object.values(prev).flat().forEach((u) => URL.revokeObjectURL(u))
        const next = {}
        list.forEach((p) => {
          next[p.id] = blobUrlsFromPost(p)
        })
        return next
      })
    } catch (e) {
      console.error(e)
      toast.error(e?.response?.data?.msg || 'No se pudieron cargar las noticias')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setReactions(loadForumReactions())
  }, [])

  useEffect(() => {
    refreshPosts()
  }, [refreshPosts, authToken])

  useEffect(() => {
    const unsub = subscribeForumUpdates(() => refreshPosts())
    return unsub
  }, [refreshPosts])

  useEffect(() => {
    const onFocus = () => refreshPosts()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refreshPosts])

  useEffect(() => {
    if (!editorRef.current || !isAdmin) return
    if (!editorRef.current.innerHTML.trim()) {
      editorRef.current.innerHTML = '<p><br></p>'
    }
  }, [isAdmin])

  const handleToolbar = (cmd, val = null) => {
    editorRef.current?.focus()
    exec(cmd, val)
  }

  const handleInsertEmoji = (ch) => {
    editorRef.current?.focus()
    exec('insertText', ch)
  }

  const handlePickMedia = async (e) => {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    for (const file of files) {
      const isImg = file.type.startsWith('image/')
      const isVid = file.type.startsWith('video/')
      if (!isImg && !isVid) {
        toast.warn(`${file.name}: solo imágenes o video`)
        continue
      }
      const max = isVid ? VIDEO_MAX : IMAGE_MAX
      if (file.size > max) {
        toast.warn(`${file.name} supera el tamaño máximo permitido`)
        continue
      }
      try {
        const buffer = await file.arrayBuffer()
        setAttachmentDrafts((d) => [
          ...d,
          { id: crypto.randomUUID(), mimeType: file.type, name: file.name, buffer }
        ])
      } catch {
        toast.error('No se pudo leer el archivo')
      }
    }
  }

  const handleRemoveDraft = (id) => {
    setAttachmentDrafts((d) => d.filter((x) => x.id !== id))
  }

  const handlePublish = async () => {
    if (!editorRef.current) return
    const raw = editorRef.current.innerHTML
    const htmlBody = sanitizeForumHtml(raw)
    const textOnly = editorRef.current.innerText?.trim() || ''
    if (!textOnly && attachmentDrafts.length === 0) {
      toast.info('Escribe un mensaje o adjunta un archivo')
      return
    }
    const firstLine = textOnly.split('\n').find((l) => l.trim()) || 'Comunicado oficial'
    const titulo = firstLine.trim().slice(0, 200)
    const files = attachmentDrafts.map((d) => bufferToFile(d.buffer, d.mimeType, d.name))
    try {
      const data = await publicarNoticiaEnApi({ titulo, contenido: htmlBody, files })
      toast.success(data?.msg || 'Publicación enviada al servidor')
      editorRef.current.innerHTML = '<p><br></p>'
      setAttachmentDrafts([])
      await refreshPosts()
    } catch (err) {
      console.error(err)
      if (err?.message === 'NO_AUTH') {
        toast.error('Debes iniciar sesión como administrador para publicar.')
      } else {
        const d = err?.response?.data
        const detail =
          (typeof d?.msg === 'string' && d.msg) ||
          (typeof d?.message === 'string' && d.message) ||
          (typeof d === 'string' && d) ||
          (d && typeof d === 'object' ? JSON.stringify(d).slice(0, 280) : '')
        toast.error(
          detail ||
            'Error 500 del servidor al publicar. Revisa logs del backend (JSON: titulo, informacion).'
        )
      }
    }
  }

  const handleAskDeletePost   = (post) => setConfirmDelete({ id: post.id, titulo: post.titulo || '' })
  const handleCancelDeletePost = () => { if (!confirmDeleteLoading) setConfirmDelete(null) }

  const handleConfirmDeletePost = async () => {
    if (!confirmDelete?.id) return
    const postId = confirmDelete.id
    setConfirmDeleteLoading(true)
    try {
      await eliminarNoticiaEnApi(postId)
      revokePostUrls(postId)
      setReactions((prev) => {
        const { [postId]: _, ...rest } = prev
        saveForumReactions(rest)
        return rest
      })
      await refreshPosts()
      toast.success('Publicación eliminada')
      setConfirmDelete(null)
    } catch (e) {
      console.error(e)
      toast.error(
        e?.response?.data?.msg ||
          'No se pudo eliminar. Revisa la ruta de eliminación en el backend.'
      )
    } finally {
      setConfirmDeleteLoading(false)
    }
  }

  const handleReaction = (postId, choice) => {
    setReactions((prev) => {
      const raw = prev[postId]
      const block = {
        likes: raw?.likes ?? 0,
        dislikes: raw?.dislikes ?? 0,
        voters: { ...(raw?.voters || {}) }
      }
      const nextBlock = applyVoteChange(block, voterKey, choice)
      const merged = { ...prev, [postId]: nextBlock }
      saveForumReactions(merged)
      broadcastForumUpdate()
      return merged
    })
  }

  const userVote = (postId) => reactions[postId]?.voters?.[voterKey]

  return (
    <>
      <section className="mx-auto mb-10 w-full" aria-labelledby="noticias-comunicados-titulo">

        {/* ── Panel de publicación (solo admin) ── */}
        {isAdmin && (
          <div className="wr-forum-compose">
            <p className="wr-pixel mb-4 text-[0.55rem] uppercase tracking-widest text-slate-400">
              Nueva publicación
            </p>

            {/* Barra de herramientas */}
            <div className="mb-3 flex flex-wrap gap-2">
              {[
                { label: 'Negrita', cmd: 'bold' },
                { label: 'Cursiva', cmd: 'italic' },
                { label: 'Subrayado', cmd: 'underline' },
                { label: 'Tachado', cmd: 'strikeThrough' }
              ].map((b) => (
                <GlareHoverButton
                  key={b.cmd}
                  type="button"
                  className="!text-[0.45rem] !px-2 !py-1 !min-h-[30px]"
                  ariaLabel={b.label}
                  title={b.label}
                  onClick={() => handleToolbar(b.cmd)}
                >
                  {b.label}
                </GlareHoverButton>
              ))}
              {[
                { label: 'Título', cmd: 'formatBlock', val: 'H2' },
                { label: 'Subtítulo', cmd: 'formatBlock', val: 'H3' },
                { label: 'Párrafo', cmd: 'formatBlock', val: 'P' },
                { label: 'Lista', cmd: 'insertUnorderedList', val: null },
                { label: 'Cita', cmd: 'formatBlock', val: 'blockquote' }
              ].map((b) => (
                <GlareHoverButton
                  key={b.label}
                  type="button"
                  className="!text-[0.45rem] !px-2 !py-1 !min-h-[30px]"
                  ariaLabel={b.label}
                  title={b.label}
                  onClick={() => handleToolbar(b.cmd, b.val)}
                >
                  {b.label}
                </GlareHoverButton>
              ))}
            </div>

            {/* Fila de emojis */}
            <div className="mb-3 flex flex-wrap gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.85)] p-2">
              <span className="w-full font-mono text-[10px] uppercase text-slate-600 mb-1">Emojis</span>
              {EMOJI_ROW.map((em) => (
                <button
                  key={em}
                  type="button"
                  className="wr-emoji-btn"
                  onClick={() => handleInsertEmoji(em)}
                  aria-label={`Insertar ${em}`}
                >
                  {em}
                </button>
              ))}
            </div>

            {/* Editor de contenido */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="wr-forum-editor"
              aria-label="Contenido del mensaje"
            />

            {/* Acciones */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <GlareHoverButton
                type="button"
                ariaLabel="Adjuntar imágenes o video"
                onClick={() => fileInputRef.current?.click()}
              >
                Adjuntar imágenes / video
              </GlareHoverButton>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={handlePickMedia}
              />
              <GlareHoverButton type="button" ariaLabel="Publicar mensaje" onClick={handlePublish}>
                Publicar
              </GlareHoverButton>
            </div>

            {/* Adjuntos en borrador */}
            {attachmentDrafts.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {attachmentDrafts.map((a) => (
                  <li key={a.id} className="wr-attach-chip">
                    <span className="max-w-[140px] truncate">{a.name}</span>
                    <button
                      type="button"
                      className="text-red-400 hover:underline text-[0.7rem]"
                      onClick={() => handleRemoveDraft(a.id)}
                      aria-label={`Quitar ${a.name}`}
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ── Lista de posts ── */}
        <div className="space-y-4">

          {/* Estado de carga */}
          {loading && (
            <div className="wr-forum-empty">
              <p className="wr-pixel text-[0.55rem] text-slate-500">Cargando foro…</p>
            </div>
          )}

          {/* Estado vacío */}
          {!loading && posts.length === 0 && (
            <div className="wr-forum-empty">
              {!authToken ? (
                <>Inicia sesión para ver las noticias que el administrador publicó en el servidor.</>
              ) : isAdmin ? (
                <>Aún no hay noticias en el servidor. Usa el panel de arriba para publicar.</>
              ) : (
                <>No hay noticias disponibles o tu usuario no tiene permiso para listarlas.</>
              )}
            </div>
          )}

          {/* Posts — Reddit layout */}
          {posts.map((post, postIdx) => {
            const rawR = reactions[post.id]
            const r = {
              likes: rawR?.likes ?? 0,
              dislikes: rawR?.dislikes ?? 0,
              voters: rawR?.voters || {}
            }
            const vote = userVote(post.id)
            const score = r.likes - r.dislikes
            const urls = blobRegistry[post.id] || []
            const serverUrls = post.serverMediaUrls || []

            return (
              <article
                key={post.id}
                className="wr-forum-card wr-rise"
                style={{ animationDelay: `${postIdx * 60}ms` }}
              >
                {/* ── Columna de votos (izquierda) ── */}
                <div className="wr-forum-vote" aria-label="Votos">
                  <button
                    type="button"
                    className={`wr-vote-btn ${vote === 'like' ? 'up-active' : ''}`}
                    onClick={() => handleReaction(post.id, 'like')}
                    aria-label="Me gusta"
                    aria-pressed={vote === 'like'}
                  >
                    <FaThumbsUp aria-hidden />
                  </button>
                  <span className="wr-vote-score" aria-label={`Puntuación: ${score}`}>
                    {score}
                  </span>
                  <button
                    type="button"
                    className={`wr-vote-btn ${vote === 'dislike' ? 'down-active' : ''}`}
                    onClick={() => handleReaction(post.id, 'dislike')}
                    aria-label="No me gusta"
                    aria-pressed={vote === 'dislike'}
                  >
                    <FaThumbsDown aria-hidden />
                  </button>
                </div>

                {/* ── Columna de contenido (derecha) ── */}
                <div className="wr-forum-body">
                  {/* Meta: tag + fecha + delete */}
                  <div className="wr-forum-meta">
                    <span className="wr-forum-tag">Soporte Wraith</span>
                    <span className="wr-forum-tag" style={{ color: '#3f3f3f' }}>·</span>
                    <time
                      className="wr-forum-time"
                      dateTime={new Date(post.createdAt).toISOString()}
                    >
                      {formatDate(post.createdAt)}
                    </time>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleAskDeletePost(post)}
                        className="wr-forum-btn wr-forum-btn-danger ml-auto !text-[0.45rem] !px-2 !py-1 !min-h-[28px] flex items-center gap-1"
                        aria-label="Eliminar publicación"
                      >
                        <FaTrash aria-hidden className="text-[0.6rem]" />
                        Eliminar
                      </button>
                    )}
                  </div>

                  {/* Título */}
                  {post.titulo && (
                    <h2 className="wr-forum-title">{post.titulo}</h2>
                  )}

                  {/* Cuerpo HTML */}
                  <div
                    className="wr-forum-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeForumHtml(post.htmlBody) }}
                  />

                  {/* Medios adjuntos */}
                  {(urls.length > 0 || serverUrls.length > 0) && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {urls.map((src, i) => {
                        const att = post.attachments?.[i]
                        const isVideo = att?.mimeType?.startsWith('video/')
                        return isVideo ? (
                          <video
                            key={`blob-${src}`}
                            src={src}
                            controls
                            className="max-h-64 w-full rounded-lg border border-[rgba(255,255,255,0.10)] bg-black object-contain"
                          />
                        ) : (
                          <img
                            key={`blob-${src}`}
                            src={src}
                            alt={`Adjunto ${i + 1}`}
                            loading="lazy"
                            className="max-h-72 w-full rounded-lg border border-[rgba(255,255,255,0.10)] object-contain"
                          />
                        )
                      })}
                      {serverUrls.map((src) =>
                        isVideoUrl(src) ? (
                          <video
                            key={`srv-${src}`}
                            src={src}
                            controls
                            className="max-h-64 w-full rounded-lg border border-[rgba(255,255,255,0.10)] bg-black object-contain"
                          />
                        ) : (
                          <img
                            key={`srv-${src}`}
                            src={src}
                            alt="Adjunto del servidor"
                            loading="lazy"
                            className="max-h-72 w-full rounded-lg border border-[rgba(255,255,255,0.10)] object-contain"
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <ConfirmDeleteNoticiaModal
        open={confirmDelete != null}
        tituloPreview={confirmDelete?.titulo}
        loading={confirmDeleteLoading}
        onCancel={handleCancelDeletePost}
        onConfirm={handleConfirmDeletePost}
      />
    </>
  )
}
