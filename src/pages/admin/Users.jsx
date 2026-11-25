import { supabase } from '../../lib/supabaseClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTable, useToast, PageHead } from './shared.jsx'

const ROLES = [
  ['customer', 'Customer — normal shopper'],
  ['staff', 'Staff — can manage products & orders'],
  ['admin', 'Admin — everything, incl. roles'],
]

export default function Users() {
  const { user } = useAuth()
  const { rows, setRows, loading, error, reload } = useTable('profiles')
  const [toast, toastNode] = useToast()

  async function changeRole(p, role) {
    if (p.id === user.id && role !== 'admin' && !window.confirm('You are removing your OWN admin access. Continue?')) return
    setRows((rs) => rs.map((r) => (r.id === p.id ? { ...r, role } : r)))
    const { error } = await supabase.from('profiles').update({ role }).eq('id', p.id)
    if (error) { toast(error.message, 'err'); reload() } else toast(`${p.email} is now ${role} ✓`)
  }

  return (
    <>
      <PageHead title="Users & Roles" subtitle="Everyone who created an account. Give “staff” to employees who should use this panel." />
      {error && <p className="adm-err">{error}</p>}
      {loading ? <p className="adm-loading">Loading…</p> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Role</th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name || '—'}{p.id === user.id && <small className="adm-sub">(you)</small>}</td>
                  <td>{p.email}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    <select value={p.role} onChange={(e) => changeRole(p, e.target.value)}>
                      {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {toastNode}
    </>
  )
}
