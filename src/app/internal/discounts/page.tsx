'use client'

import { useEffect, useState, useCallback } from 'react'

type Ambassador = {
  id: string
  name: string
  referral_code: string
  self_purchase_code: string
  self_purchase_used: boolean
  order_count: number
  free_products_fulfilled: number
  free_products_owed: number
  active: boolean
}

type Coupon = {
  id: string
  code: string
  discount_percent: number
  stacks: boolean
  active: boolean
}

type Settings = {
  referral_discount_percent: number
  self_purchase_discount_percent: number
}

export default function DiscountsAdminPage() {
  const [secret, setSecret] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [secretInput, setSecretInput] = useState('')
  const [tab, setTab] = useState<'ambassadors' | 'coupons' | 'settings'>('ambassadors')

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_secret')
    if (stored) {
      setSecret(stored)
      setUnlocked(true)
    }
  }, [])

  const handleUnlock = () => {
    sessionStorage.setItem('admin_secret', secretInput)
    setSecret(secretInput)
    setUnlocked(true)
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm space-y-4">
          <h1 className="text-lg font-semibold text-gray-900">Admin Access</h1>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="Admin secret"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-500"
          />
          <button
            onClick={handleUnlock}
            disabled={!secretInput}
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium disabled:opacity-50"
          >
            Enter
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">Discounts</h1>

        <div className="flex gap-2 border-b border-gray-200">
          {(['ambassadors', 'coupons', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px ${
                tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'ambassadors' && <AmbassadorsTab secret={secret} />}
        {tab === 'coupons' && <CouponsTab secret={secret} />}
        {tab === 'settings' && <SettingsTab secret={secret} />}
      </div>
    </main>
  )
}

function AmbassadorsTab({ secret }: { secret: string }) {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/ambassadors', { headers: { 'x-admin-secret': secret } })
    const data = await res.json()
    if (res.ok) setAmbassadors(data.ambassadors)
    else setError(data.error || 'Failed to load')
    setLoading(false)
  }, [secret])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!name.trim()) return
    setCreating(true)
    setError('')
    const res = await fetch('/api/admin/ambassadors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ name: name.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setName('')
      load()
    } else {
      setError(data.error || 'Failed to create ambassador')
    }
    setCreating(false)
  }

  const handleFulfill = async (id: string) => {
    await fetch(`/api/admin/ambassadors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ action: 'fulfill' }),
    })
    load()
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/ambassadors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ active: !active }),
    })
    load()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ambassador name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-500 text-sm"
        />
        <button
          onClick={handleCreate}
          disabled={!name.trim() || creating}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Add Ambassador'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Referral Code</th>
                <th className="px-4 py-3 font-medium">Self-Purchase Code</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Owed</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {ambassadors.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3 font-mono">{a.referral_code}</td>
                  <td className="px-4 py-3 font-mono">
                    {a.self_purchase_code}
                    {a.self_purchase_used && <span className="text-gray-400 ml-1">(used)</span>}
                  </td>
                  <td className="px-4 py-3">{a.order_count}</td>
                  <td className="px-4 py-3">
                    {a.free_products_owed > 0 ? (
                      <span className="text-green-600 font-medium">{a.free_products_owed} owed</span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleActive(a.id, a.active)} className="underline">
                      {a.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {a.free_products_owed > 0 && (
                      <button
                        onClick={() => handleFulfill(a.id)}
                        className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium"
                      >
                        Mark fulfilled
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {ambassadors.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No ambassadors yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CouponsTab({ secret }: { secret: string }) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [code, setCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [stacks, setStacks] = useState(false)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/coupons', { headers: { 'x-admin-secret': secret } })
    const data = await res.json()
    if (res.ok) setCoupons(data.coupons)
    else setError(data.error || 'Failed to load')
    setLoading(false)
  }, [secret])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!code.trim() || !discountPercent) return
    setCreating(true)
    setError('')
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ code: code.trim(), discount_percent: Number(discountPercent), stacks }),
    })
    const data = await res.json()
    if (res.ok) {
      setCode('')
      setDiscountPercent('')
      setStacks(false)
      load()
    } else {
      setError(data.error || 'Failed to create coupon')
    }
    setCreating(false)
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ active: !active }),
    })
    load()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-2 items-center">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CODE"
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-500 text-sm uppercase w-32"
        />
        <input
          type="number"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          placeholder="% off"
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-500 text-sm w-24"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={stacks} onChange={(e) => setStacks(e.target.checked)} />
          Stacks with existing discount
        </label>
        <button
          onClick={handleCreate}
          disabled={!code.trim() || !discountPercent || creating}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create Coupon'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-mono">{c.code}</td>
                  <td className="px-4 py-3">{c.discount_percent}%</td>
                  <td className="px-4 py-3">{c.stacks ? 'Stacks' : 'Flat override'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleActive(c.id, c.active)} className="underline">
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No coupons yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SettingsTab({ secret }: { secret: string }) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [referralPercent, setReferralPercent] = useState('')
  const [selfPurchasePercent, setSelfPurchasePercent] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/referral-settings', { headers: { 'x-admin-secret': secret } })
    const data = await res.json()
    if (res.ok) {
      setSettings(data.settings)
      setReferralPercent(String(data.settings.referral_discount_percent))
      setSelfPurchasePercent(String(data.settings.self_purchase_discount_percent))
    }
  }, [secret])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/admin/referral-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({
        referral_discount_percent: Number(referralPercent),
        self_purchase_discount_percent: Number(selfPurchasePercent),
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setSettings(data.settings)
      setMessage('Saved — takes effect on the next checkout immediately.')
    } else {
      setMessage(data.error || 'Failed to save')
    }
    setSaving(false)
  }

  if (!settings) return <p className="text-sm text-gray-400">Loading...</p>

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-md space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Referral discount %</label>
        <input
          type="number"
          value={referralPercent}
          onChange={(e) => setReferralPercent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-500 text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Self-purchase discount %</label>
        <input
          type="number"
          value={selfPurchasePercent}
          onChange={(e) => setSelfPurchasePercent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-500 text-sm"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  )
}
