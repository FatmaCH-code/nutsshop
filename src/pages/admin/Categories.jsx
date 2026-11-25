import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { useSiteData } from '../../context/SiteDataContext.jsx'
import { slugify } from '../../data/defaults.js'
import { useTable, useToast, ImageInput, Field, Toggle, Drawer, PageHead } from './shared.jsx'

export default function Categories() {
  const { rows, loading, error, reload } = useTable('categories', { order: 'sort_order', ascending: true })
  const { refresh } = useSiteData()
  const [toast, toastNode] = useToast()
  const [editing, setEditing] = useState(null)

  const set = (k, v) => setEditing((e) => ({ ...e, [k]: v, ...(k === 'name' && e.isNew ? { slug: slugify(v) } : {}) }))

  async function save(e) {
    e.preventDefault()
    const payload = { name: editing.name, image_url: editing.image_url || null, show_on_home: editing.show_on_home, sort_order: Number(editing.sort_order) || 0 }
    const { error } = editing.isNew
      ? await supabase.from('categories').insert({ ...payload, slug: slugify(editing.slug || editing.name) })
      : await supabase.from('categories').update(payload).eq('slug', editing.slug)
    if (error) return toast(error.message, 'err')
    toast('Category saved ✓'); setEditing(null); reload(); refresh()
  }

  async function remove(c) {
    if (!window.confirm(`Delete category "${c.name}"? Products will stay, they just won't be in this category anymore.`)) return
    const { error } = await supabase.from('categories').delete().eq('slug', c.slug)
    if (error) return toast(error.message, 'err')
    toast('Category deleted'); setEditing(null); reload(); refresh()
  }

  return (
    <>
      <PageHead title="Categories" subtitle="Collections pages and the “Shop by Category” tiles on the home page"
        action={<button className="adm-btn adm-btn-gold" onClick={() => setEditing({ isNew: true, name: '', slug: '', image_url: '', show_on_home: true, sort_order: rows.length })}>+ Add category</button>} />
      {error && <p className="adm-err">{error}</p>}
      {loading ? <p className="adm-loading">Loading…</p> : (
        <div className="adm-cards-grid">
          {rows.map((c) => (
            <button key={c.slug} className="adm-tile" onClick={() => setEditing({ ...c })}>
              <div className="adm-tile-img" style={{ backgroundImage: c.image_url ? `url(${c.image_url})` : 'none' }} />
              <div className="adm-tile-body">
                <strong>{c.name}</strong>
                <small>/collections/{c.slug}</small>
                {c.show_on_home && c.image_url && <span className="adm-pill">On home page</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {editing && (
        <Drawer title={editing.isNew ? 'New category' : `Edit: ${editing.name}`} onClose={() => setEditing(null)}
          footer={<>
            {!editing.isNew && <button type="button" className="adm-btn adm-btn-danger" onClick={() => remove(editing)}>Delete</button>}
            <span style={{ flex: 1 }} />
            <button type="button" className="adm-btn" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" form="cat-form" className="adm-btn adm-btn-gold">Save</button>
          </>}>
          <form id="cat-form" className="adm-form" onSubmit={save}>
            <Field label="Name"><input value={editing.name} onChange={(e) => set('name', e.target.value)} required /></Field>
            <Field label="URL name (slug)" hint={editing.isNew ? 'Used in the link /collections/…' : 'Cannot be changed (menu links use it)'}>
              <input value={editing.slug} disabled={!editing.isNew} onChange={(e) => set('slug', e.target.value)} />
            </Field>
            <ImageInput label="Tile image" value={editing.image_url} onChange={(v) => set('image_url', v)} folder="categories" />
            <Field label="Display order"><input type="number" value={editing.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></Field>
            <Toggle checked={editing.show_on_home} onChange={(v) => set('show_on_home', v)} label="Show as a tile on the home page (needs an image)" />
          </form>
        </Drawer>
      )}
      {toastNode}
    </>
  )
}
