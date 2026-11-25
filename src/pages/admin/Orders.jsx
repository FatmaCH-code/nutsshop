import { useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { money, ORDER_STATUSES } from '../../data/defaults.js'
import { useTable, useToast, Drawer, Field, PageHead } from './shared.jsx'

const fmt = (d) => new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })

export default function Orders() {
  const { rows, setRows, loading, error, reload } = useTable('orders')
  const [toast, toastNode] = useToast()
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(null)

  const counts = useMemo(() => Object.fromEntries(ORDER_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])), [rows])
  const filtered = rows.filter((o) =>
    (!status || o.status === status) &&
    (!search || `${o.id} ${o.customer_name} ${o.phone} ${o.email}`.toLowerCase().includes(search.toLowerCase()))
  )

  async function update(o, patch) {
    setRows((rs) => rs.map((r) => (r.id === o.id ? { ...r, ...patch } : r)))
    if (open?.id === o.id) setOpen((x) => ({ ...x, ...patch }))
    const { error } = await supabase.from('orders').update(patch).eq('id', o.id)
    if (error) { toast(error.message, 'err'); reload() } else toast('Order updated ✓')
  }

  async function remove(o) {
    if (!window.confirm(`Delete order #${o.id}? This cannot be undone.`)) return
    const { error } = await supabase.from('orders').delete().eq('id', o.id)
    if (error) return toast(error.message, 'err')
    setOpen(null); reload(); toast('Order deleted')
  }

  return (
    <>
      <PageHead title="Orders" subtitle="Change the status as you prepare each order"
        action={<button className="adm-btn" onClick={reload}>↻ Refresh</button>} />

      <div className="adm-tabs">
        <button className={!status ? 'is-active' : ''} onClick={() => setStatus('')}>All <span>{rows.length}</span></button>
        {ORDER_STATUSES.map((s) => (
          <button key={s} className={status === s ? 'is-active' : ''} onClick={() => setStatus(s)}>{s} <span>{counts[s]}</span></button>
        ))}
      </div>
      <div className="adm-toolbar">
        <input className="adm-search" placeholder="Search by #, name, phone, email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <p className="adm-err">{error}</p>}
      {loading ? <p className="adm-loading">Loading…</p> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>#</th><th>Date</th><th>Customer</th><th>Type</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="is-clickable" onClick={() => setOpen(o)}>
                  <td><strong>#{o.id}</strong></td>
                  <td>{fmt(o.created_at)}</td>
                  <td>{o.customer_name}<small className="adm-sub">{o.phone}</small></td>
                  <td>{o.delivery_method === 'delivery' ? '🚚 Delivery' : '🏬 Pickup'}</td>
                  <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td><strong>{money(o.subtotal)}</strong></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select className={`adm-status-select s-${o.status}`} value={o.status} onChange={(e) => update(o, { status: e.target.value })}>
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="adm-empty">No orders here yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <Drawer title={`Order #${open.id}`} onClose={() => setOpen(null)}
          footer={<>
            <button className="adm-btn adm-btn-danger" onClick={() => remove(open)}>Delete</button>
            <span style={{ flex: 1 }} />
            <button className="adm-btn" onClick={() => window.print()}>🖨 Print</button>
            <button className="adm-btn adm-btn-gold" onClick={() => setOpen(null)}>Done</button>
          </>}>
          <div className="adm-order">
            <p className="adm-sub">{fmt(open.created_at)}</p>
            <Field label="Status">
              <select className={`adm-status-select s-${open.status}`} value={open.status} onChange={(e) => update(open, { status: e.target.value })}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <div className="adm-card">
              <h3>Customer</h3>
              <p><strong>{open.customer_name}</strong></p>
              <p><a href={`tel:${open.phone}`}>{open.phone}</a> · <a href={`mailto:${open.email}`}>{open.email}</a></p>
              <p>{open.delivery_method === 'delivery' ? `🚚 Delivery to: ${open.address}` : '🏬 Pickup in store'}</p>
              {open.notes && <p className="adm-note">“{open.notes}”</p>}
            </div>

            <div className="adm-card">
              <h3>Items</h3>
              {open.items.map((i, idx) => (
                <div className="adm-order-line" key={idx}>
                  <div className="adm-thumb" style={{ backgroundImage: `url(${i.image})` }} />
                  <span>{i.qty} × {i.name}{i.weight && <small className="adm-sub">{i.weight}</small>}</span>
                  <span>{money(i.unit_price * i.qty)}</span>
                </div>
              ))}
              <div className="adm-order-total"><span>Total</span><strong>{money(open.subtotal)}</strong></div>
            </div>

            <Field label="Private note (only staff can see it)">
              <textarea rows={3} defaultValue={open.admin_note || ''} onBlur={(e) => e.target.value !== (open.admin_note || '') && update(open, { admin_note: e.target.value })} />
            </Field>
          </div>
        </Drawer>
      )}
      {toastNode}
    </>
  )
}
