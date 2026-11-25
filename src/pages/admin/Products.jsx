import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import { useSiteData } from '../../context/SiteDataContext.jsx'
import { money, slugify } from '../../data/defaults.js'
import { useTable, useToast, ImageInput, Field, Toggle, Drawer, PageHead } from './shared.jsx'

const EMPTY = {
  name: '', slug: '', description: '', base_price: '', compare_at_price: '',
  has_weight: true, category: [], image_url: '', stock: '', is_active: true, sort_order: 0,
}

export default function Products() {
  const { rows, setRows, loading, error, reload } = useTable('products', { order: 'sort_order', ascending: true })
  const { rows: cats } = useTable('categories', { order: 'sort_order', ascending: true })
  const { refresh } = useSiteData()
  const [toast, toastNode] = useToast()
  const [params, setParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (params.get('new')) { openNew(); setParams({}, { replace: true }) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => rows.filter((p) =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter || (p.category || []).includes(catFilter))
  ), [rows, search, catFilter])

  const catName = (slug) => cats.find((c) => c.slug === slug)?.name || slug

  function openNew() { setEditing({ ...EMPTY }); setSlugTouched(false) }
  function openEdit(p) {
    setEditing({ ...p, compare_at_price: p.compare_at_price ?? '', stock: p.stock ?? '', description: p.description || '' })
    setSlugTouched(true)
  }
  const set = (k, v) => setEditing((e) => {
    const next = { ...e, [k]: v }
    if (k === 'name' && !slugTouched) next.slug = slugify(v)
    return next
  })
  const toggleCat = (slug) => set('category', editing.category.includes(slug) ? editing.category.filter((c) => c !== slug) : [...editing.category, slug])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: editing.name.trim(),
      slug: slugify(editing.slug || editing.name),
      description: editing.description,
      base_price: Number(editing.base_price),
      compare_at_price: editing.compare_at_price === '' ? null : Number(editing.compare_at_price),
      has_weight: editing.has_weight,
      category: editing.category,
      image_url: editing.image_url,
      stock: editing.stock === '' ? null : parseInt(editing.stock, 10),
      is_active: editing.is_active,
      sort_order: Number(editing.sort_order) || 0,
    }
    const { error } = editing.id
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert(payload)
    setSaving(false)
    if (error) return toast(error.message.includes('duplicate') ? 'That URL name (slug) is already used by another product.' : error.message, 'err')
    toast(editing.id ? 'Product updated ✓' : 'Product added ✓')
    setEditing(null)
    reload(); refresh()
  }

  async function quickUpdate(p, patch) {
    setRows((rs) => rs.map((r) => (r.id === p.id ? { ...r, ...patch } : r)))
    const { error } = await supabase.from('products').update(patch).eq('id', p.id)
    if (error) { toast(error.message, 'err'); reload() } else refresh()
  }

  async function remove(p) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.\n(Tip: you can hide it instead with the "Visible" switch.)`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) return toast(error.message, 'err')
    toast('Product deleted'); setEditing(null); reload(); refresh()
  }

  function duplicate(p) {
    const { id, created_at, ...rest } = p // eslint-disable-line no-unused-vars
    setEditing({ ...rest, name: `${p.name} (copy)`, slug: `${p.slug}-copy`, compare_at_price: p.compare_at_price ?? '', stock: p.stock ?? '' })
    setSlugTouched(true)
  }

  return (
    <>
      <PageHead title="Products" subtitle={`${rows.length} products`}
        action={<button className="adm-btn adm-btn-gold" onClick={openNew}>+ Add product</button>} />

      <div className="adm-toolbar">
        <input className="adm-search" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {error && <p className="adm-err">{error}</p>}
      {loading ? <p className="adm-loading">Loading…</p> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th></th><th>Product</th><th>Price</th><th>Stock</th><th>Categories</th><th>Visible</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={p.is_active ? '' : 'is-muted'}>
                  <td><div className="adm-thumb" style={{ backgroundImage: `url(${p.image_url})` }} /></td>
                  <td>
                    <button className="adm-link-strong" onClick={() => openEdit(p)}>{p.name}</button>
                    <small className="adm-sub">{p.has_weight ? 'Sold by weight (lb / ½ lb)' : 'Sold per piece'}</small>
                  </td>
                  <td>
                    {money(p.base_price)}
                    {p.compare_at_price && <s className="adm-sub">{money(p.compare_at_price)}</s>}
                  </td>
                  <td>
                    <input className="adm-stock-input" type="number" min="0" placeholder="∞" value={p.stock ?? ''}
                      onChange={(e) => setRows((rs) => rs.map((r) => (r.id === p.id ? { ...r, stock: e.target.value === '' ? null : Number(e.target.value) } : r)))}
                      onBlur={(e) => quickUpdate(p, { stock: e.target.value === '' ? null : parseInt(e.target.value, 10) })} />
                  </td>
                  <td><div className="adm-chips">{(p.category || []).map((c) => <span key={c}>{catName(c)}</span>)}</div></td>
                  <td><Toggle checked={p.is_active} onChange={(v) => quickUpdate(p, { is_active: v })} /></td>
                  <td className="adm-row-actions">
                    <button className="adm-btn adm-btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="adm-btn adm-btn-sm" onClick={() => duplicate(p)} title="Duplicate">⧉</button>
                    <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(p)} title="Delete">🗑</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="adm-empty">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Drawer title={editing.id ? 'Edit product' : 'New product'} onClose={() => setEditing(null)}
          footer={<>
            {editing.id && <button type="button" className="adm-btn adm-btn-danger" onClick={() => remove(editing)}>Delete</button>}
            <span style={{ flex: 1 }} />
            <button type="button" className="adm-btn" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" form="product-form" className="adm-btn adm-btn-gold" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
          </>}>
          <form id="product-form" className="adm-form" onSubmit={save}>
            <Field label="Product name"><input value={editing.name} onChange={(e) => set('name', e.target.value)} required /></Field>
            <Field label="URL name (slug)" hint={`Page address: /products/${slugify(editing.slug || editing.name) || '…'}`}>
              <input value={editing.slug} onChange={(e) => { setSlugTouched(true); set('slug', e.target.value) }} />
            </Field>
            <ImageInput value={editing.image_url} onChange={(v) => set('image_url', v)} folder="products" />
            <Field label="Description"><textarea rows={4} value={editing.description} onChange={(e) => set('description', e.target.value)} /></Field>

            <div className="adm-grid-2">
              <Field label={editing.has_weight ? 'Price for 1 lb ($)' : 'Price ($)'} hint={editing.has_weight ? `½ lb = ${money((Number(editing.base_price) || 0) * 0.6)}` : null}>
                <input type="number" step="0.01" min="0" value={editing.base_price} onChange={(e) => set('base_price', e.target.value)} required />
              </Field>
              <Field label="Old price ($), optional" hint="Shows a SALE badge with the old price crossed out">
                <input type="number" step="0.01" min="0" value={editing.compare_at_price} onChange={(e) => set('compare_at_price', e.target.value)} />
              </Field>
              <Field label="Stock" hint="Leave empty = unlimited. 0 = sold out.">
                <input type="number" min="0" value={editing.stock} onChange={(e) => set('stock', e.target.value)} />
              </Field>
              <Field label="Display order" hint="Smaller number shows first">
                <input type="number" value={editing.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
              </Field>
            </div>

            <Toggle checked={editing.has_weight} onChange={(v) => set('has_weight', v)} label="Sold by weight (customer picks One Pound / Half Pound)" />
            <Toggle checked={editing.is_active} onChange={(v) => set('is_active', v)} label="Visible on the website" />

            <div className="adm-field">
              <span className="adm-label">Categories <small className="adm-hint">(also: Best Sellers / Hot Items / Discounts = home page rows)</small></span>
              <div className="adm-check-grid">
                {cats.map((c) => (
                  <label key={c.slug} className={editing.category.includes(c.slug) ? 'adm-check is-on' : 'adm-check'}>
                    <input type="checkbox" checked={editing.category.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          </form>
        </Drawer>
      )}
      {toastNode}
    </>
  )
}
