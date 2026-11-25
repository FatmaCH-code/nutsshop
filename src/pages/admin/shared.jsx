import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../lib/supabaseClient.js'

// Load a whole table, with a reload() function.
export function useTable(table, { order = 'created_at', ascending = false, select = '*' } = {}) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from(table).select(select).order(order, { ascending })
    setRows(data || [])
    setError(error ? error.message : '')
    setLoading(false)
  }, [table, order, ascending, select])

  useEffect(() => { reload() }, [reload])
  return { rows, setRows, loading, error, reload }
}

// Small toast message at the bottom of the screen
export function useToast() {
  const [toast, setToast] = useState(null)
  const timer = useRef()
  const show = useCallback((text, kind = 'ok') => {
    setToast({ text, kind })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])
  const node = toast ? <div className={`adm-toast adm-toast-${toast.kind}`}>{toast.text}</div> : null
  return [show, node]
}

// Upload a file to the public "images" bucket and return its URL
export async function uploadImage(file, folder = 'products') {
  const ext = file.name.split('.').pop().toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('images').upload(path, file, { cacheControl: '31536000', upsert: false })
  if (error) throw error
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}

// Image field: paste a URL or upload from the computer, with preview
export function ImageInput({ label = 'Image', value, onChange, folder, wide = false }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef()

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr('')
    setBusy(true)
    try {
      onChange(await uploadImage(file, folder))
    } catch (ex) {
      setErr(ex.message)
    }
    setBusy(false)
    e.target.value = ''
  }

  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div className="adm-image-input">
        <div className={wide ? 'adm-image-preview is-wide' : 'adm-image-preview'} style={{ backgroundImage: value ? `url(${value})` : 'none' }}>
          {!value && <span>No image</span>}
        </div>
        <div className="adm-image-controls">
          <button type="button" className="adm-btn" onClick={() => fileRef.current.click()} disabled={busy}>
            {busy ? 'Uploading…' : '⬆ Upload from computer'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
          <input type="url" placeholder="…or paste an image link" value={value || ''} onChange={(e) => onChange(e.target.value)} />
          {err && <small className="adm-err">{err}</small>}
        </div>
      </div>
    </div>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      {children}
      {hint && <small className="adm-hint">{hint}</small>}
    </label>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="adm-toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="adm-toggle-track"><span /></span>
      {label && <span>{label}</span>}
    </label>
  )
}

export function Drawer({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return createPortal(
    <div className="adm-drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-drawer">
        <div className="adm-drawer-head">
          <h2>{title}</h2>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="adm-drawer-body">{children}</div>
        {footer && <div className="adm-drawer-foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

export function PageHead({ title, subtitle, action }) {
  return (
    <div className="adm-page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
