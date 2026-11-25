import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { useSiteData } from '../../context/SiteDataContext.jsx'
import { useTable, useToast, ImageInput, Field, Toggle, Drawer, PageHead } from './shared.jsx'

const EMPTY = {
  title: '', subtitle: '', image_url: '', cta_label: 'Shop Now', cta_href: '/collections/best-sellers',
  secondary_label: 'Explore Gifts', secondary_href: '/collections/gifts', is_active: true,
}

export default function Slides() {
  const { rows, loading, error, reload } = useTable('hero_slides', { order: 'sort_order', ascending: true })
  const { refresh } = useSiteData()
  const [toast, toastNode] = useToast()
  const [editing, setEditing] = useState(null)
  const set = (k, v) => setEditing((e) => ({ ...e, [k]: v }))

  async function save(e) {
    e.preventDefault()
    const { id, ...payload } = editing
    const { error } = id
      ? await supabase.from('hero_slides').update(payload).eq('id', id)
      : await supabase.from('hero_slides').insert({ ...payload, sort_order: rows.length })
    if (error) return toast(error.message, 'err')
    toast('Slide saved ✓'); setEditing(null); reload(); refresh()
  }

  async function remove(s) {
    if (!window.confirm('Delete this slide?')) return
    const { error } = await supabase.from('hero_slides').delete().eq('id', s.id)
    if (error) return toast(error.message, 'err')
    toast('Slide deleted'); setEditing(null); reload(); refresh()
  }

  async function move(index, dir) {
    const a = rows[index], b = rows[index + dir]
    if (!b) return
    await Promise.all([
      supabase.from('hero_slides').update({ sort_order: index + dir }).eq('id', a.id),
      supabase.from('hero_slides').update({ sort_order: index }).eq('id', b.id),
    ])
    reload(); refresh()
  }

  async function toggle(s, v) {
    await supabase.from('hero_slides').update({ is_active: v }).eq('id', s.id)
    reload(); refresh()
  }

  return (
    <>
      <PageHead title="Home Slides" subtitle="The big rotating banner at the top of the home page"
        action={<button className="adm-btn adm-btn-gold" onClick={() => setEditing({ ...EMPTY })}>+ Add slide</button>} />
      {error && <p className="adm-err">{error}</p>}
      {loading ? <p className="adm-loading">Loading…</p> : (
        <div className="adm-slides">
          {rows.map((s, i) => (
            <div key={s.id} className={s.is_active ? 'adm-slide' : 'adm-slide is-muted'}>
              <div className="adm-slide-img" style={{ backgroundImage: `url(${s.image_url})` }}>
                <div><strong>{s.title}</strong><span>{s.subtitle}</span></div>
              </div>
              <div className="adm-slide-actions">
                <button className="adm-btn adm-btn-sm" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">↑</button>
                <button className="adm-btn adm-btn-sm" onClick={() => move(i, 1)} disabled={i === rows.length - 1} title="Move down">↓</button>
                <Toggle checked={s.is_active} onChange={(v) => toggle(s, v)} label="Visible" />
                <span style={{ flex: 1 }} />
                <button className="adm-btn adm-btn-sm" onClick={() => setEditing({ ...s })}>Edit</button>
                <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(s)}>🗑</button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="adm-empty">No slides yet — the home page will start directly with the products.</p>}
        </div>
      )}

      {editing && (
        <Drawer title={editing.id ? 'Edit slide' : 'New slide'} onClose={() => setEditing(null)}
          footer={<>
            <span style={{ flex: 1 }} />
            <button type="button" className="adm-btn" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" form="slide-form" className="adm-btn adm-btn-gold">Save slide</button>
          </>}>
          <form id="slide-form" className="adm-form" onSubmit={save}>
            <ImageInput label="Background image (wide, at least 1600px)" value={editing.image_url} onChange={(v) => set('image_url', v)} folder="slides" wide />
            <Field label="Title"><input value={editing.title} onChange={(e) => set('title', e.target.value)} required /></Field>
            <Field label="Subtitle"><input value={editing.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} /></Field>
            <div className="adm-grid-2">
              <Field label="Main button text" hint="Leave empty to hide"><input value={editing.cta_label || ''} onChange={(e) => set('cta_label', e.target.value)} /></Field>
              <Field label="Main button link"><input value={editing.cta_href || ''} onChange={(e) => set('cta_href', e.target.value)} placeholder="/collections/gifts" /></Field>
              <Field label="Second button text" hint="Leave empty to hide"><input value={editing.secondary_label || ''} onChange={(e) => set('secondary_label', e.target.value)} /></Field>
              <Field label="Second button link"><input value={editing.secondary_href || ''} onChange={(e) => set('secondary_href', e.target.value)} /></Field>
            </div>
            <Toggle checked={editing.is_active} onChange={(v) => set('is_active', v)} label="Visible on the website" />
          </form>
        </Drawer>
      )}
      {toastNode}
    </>
  )
}
