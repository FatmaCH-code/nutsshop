import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { useSiteData } from '../../context/SiteDataContext.jsx'
import { DEFAULT_SETTINGS } from '../../data/defaults.js'
import { useToast, ImageInput, Field, Toggle, PageHead } from './shared.jsx'

const GROUPS = [
  { title: 'Store info', fields: [
    ['storeName', 'Store name'], ['tagline', 'Tagline'], ['address', 'Address'], ['phone', 'Phone'],
    ['email', 'Email'], ['hours', 'Opening hours', 'e.g. Mon–Sat 10am–9pm · Sun 12–7pm'],
  ] },
  { title: 'Top of the site', fields: [
    ['announcement', 'Announcement bar (gold strip above the logo)', 'Leave empty to hide it'],
  ] },
  { title: 'Home page', fields: [
    ['dealsTitle', 'Title of the “Discounts” row'], ['bestTitle', 'Title of the “Best sellers” row'], ['hotTitle', 'Title of the “Hot items” row'],
    ['aboutTitle', 'About section: title'], ['aboutText', 'About section: text', null, 'textarea'], ['aboutImage', 'About section: image', null, 'image'],
    ['giftTitle', 'Gift banner: title'], ['giftText', 'Gift banner: text'], ['giftImage', 'Gift banner: image', null, 'image'],
    ['showAppBanner', 'Show the “Download our app” banner', null, 'toggle'],
  ] },
  { title: 'Footer & social', fields: [
    ['footerText', 'Footer text', null, 'textarea'], ['thankYouText', 'Footer message'],
    ['facebook', 'Facebook link'], ['instagram', 'Instagram link'],
  ] },
  { title: 'Checkout', fields: [
    ['checkoutNote', 'Message shown at checkout & after ordering', null, 'textarea'],
  ] },
]

export default function Settings() {
  const { refresh } = useSiteData()
  const [toast, toastNode] = useToast()
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 1).maybeSingle()
      .then(({ data: row }) => setData({ ...DEFAULT_SETTINGS, ...(row?.data || {}) }))
  }, [])

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }))

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('site_settings').upsert({ id: 1, data })
    setSaving(false)
    if (error) return toast(error.message, 'err')
    toast('Settings saved ✓'); refresh()
  }

  if (!data) return <p className="adm-loading">Loading…</p>

  return (
    <form onSubmit={save}>
      <PageHead title="Site Settings" subtitle="Texts, contact info and images shown on the website"
        action={<button className="adm-btn adm-btn-gold" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>} />
      {GROUPS.map((g) => (
        <section className="adm-card adm-form" key={g.title}>
          <h2>{g.title}</h2>
          <div className="adm-grid-2">
            {g.fields.map(([key, label, hint, type]) => {
              if (type === 'image') return <div className="adm-span-2" key={key}><ImageInput label={label} value={data[key]} onChange={(v) => set(key, v)} folder="site" wide /></div>
              if (type === 'toggle') return <div className="adm-span-2" key={key}><Toggle checked={data[key]} onChange={(v) => set(key, v)} label={label} /></div>
              if (type === 'textarea') return <div className="adm-span-2" key={key}><Field label={label} hint={hint}><textarea rows={3} value={data[key] || ''} onChange={(e) => set(key, e.target.value)} /></Field></div>
              return <Field key={key} label={label} hint={hint}><input value={data[key] || ''} onChange={(e) => set(key, e.target.value)} /></Field>
            })}
          </div>
        </section>
      ))}
      <div className="adm-save-bar"><button className="adm-btn adm-btn-gold" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div>
      {toastNode}
    </form>
  )
}
