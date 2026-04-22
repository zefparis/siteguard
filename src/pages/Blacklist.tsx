import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SelfieCapture } from '../components/SelfieCapture'
import { getBlacklist, blacklistPerson, removeBlacklist } from '../services/api'

export function Blacklist() {
  const nav = useNavigate()
  const [list,     setList]     = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [adding,   setAdding]   = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [capturedB64, setCapturedB64] = useState<string | null>(null)
  const [externalId,  setExternalId]  = useState('')
  const [reason,      setReason]      = useState('')
  const [operator,    setOperator]    = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBlacklist()
      setList(data.blacklist)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load blacklist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!capturedB64) { setError('Please capture a photo first.'); return }
    if (!externalId.trim() || !reason.trim() || !operator.trim()) { setError('All fields are required.'); return }
    setAdding(true)
    setError(null)
    try {
      await blacklistPerson({ selfie_b64: capturedB64, external_id: externalId.trim(), reason: reason.trim(), operator: operator.trim() })
      setSuccess('Person added to blacklist')
      setCapturedB64(null); setExternalId(''); setReason(''); setOperator('')
      setShowForm(false)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add')
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (faceId: string) => {
    if (!confirm('Remove this person from the blacklist?')) return
    setRemoving(faceId)
    try {
      await removeBlacklist(faceId)
      setList(l => l.filter(x => x.face_id !== faceId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to remove')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <div className="logo">🏗️ SITEGUARD</div>
      <h1 className="step-title">Blacklist</h1>
      <p className="step-sub">Individuals banned from all sites</p>

      {success && (
        <div style={{ color: 'var(--green)', marginBottom: 16, fontSize: 14, textAlign: 'center', width: '100%' }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ color: 'var(--red)', marginBottom: 16, fontSize: 14, textAlign: 'center', width: '100%' }}>
          {error}
        </div>
      )}

      <div style={{ width: '100%', marginBottom: 20 }}>
        <button className="btn btn-danger" onClick={() => { setShowForm(f => !f); setError(null); setSuccess(null) }}>
          {showForm ? 'Cancel' : '🚫 Add to Blacklist'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ width: '100%', marginBottom: 24 }}>
          <div className="badge badge-red">New Entry</div>
          <div style={{ marginBottom: 16 }}>
            <SelfieCapture onCapture={b64 => { setCapturedB64(b64); setError(null) }} loading={adding} actionLabel="Capture Photo" />
          </div>
          <form onSubmit={handleAdd}>
            <div className="field">
              <label>Person ID</label>
              <input value={externalId} onChange={e => setExternalId(e.target.value)} placeholder="ID-001" disabled={adding} />
            </div>
            <div className="field">
              <label>Reason</label>
              <select value={reason} onChange={e => setReason(e.target.value)} disabled={adding}>
                <option value="">— Select reason —</option>
                <option value="Safety violation">Safety violation</option>
                <option value="Trespassing">Trespassing</option>
                <option value="Dismissed — misconduct">Dismissed — misconduct</option>
                <option value="Dismissed — theft">Dismissed — theft</option>
                <option value="Court order">Court order</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Operator / Staff ID</label>
              <input value={operator} onChange={e => setOperator(e.target.value)} placeholder="STAFF-001" disabled={adding} />
            </div>
            <button type="submit" className="btn btn-danger" disabled={adding || !capturedB64}>
              {adding ? 'Adding…' : '🚫 Confirm Add'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--grey)' }}>Loading…</p>
      ) : list.length === 0 ? (
        <div className="card" style={{ width: '100%', textAlign: 'center' }}>
          <p style={{ color: 'var(--grey)' }}>Blacklist is empty.</p>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(entry => (
            <div key={entry.face_id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{entry.external_id}</div>
                <div style={{ fontSize: 12, color: 'var(--grey)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span className="badge badge-red" style={{ marginBottom: 0, fontSize: 10 }}>{entry.reason}</span>
                  {entry.operator && <span>By: {entry.operator}</span>}
                  {entry.banned_at && <span>{new Date(entry.banned_at).toLocaleDateString()}</span>}
                </div>
              </div>
              <button
                className="btn btn-outline"
                style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
                disabled={removing === entry.face_id}
                onClick={() => handleRemove(entry.face_id)}
              >
                {removing === entry.face_id ? '…' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-outline" style={{ marginTop: 24 }} onClick={() => nav('/')}>← Back</button>
    </div>
  )
}
