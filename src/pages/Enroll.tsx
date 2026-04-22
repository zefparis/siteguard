import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SelfieCapture } from '../components/SelfieCapture'
import { enrollWorker } from '../services/api'

export function Enroll() {
  const nav = useNavigate()
  const [capturedB64,    setCapturedB64]    = useState<string | null>(null)
  const [externalId,     setExternalId]     = useState('')
  const [name,           setName]           = useState('')
  const [role,           setRole]           = useState('')
  const [siteId,         setSiteId]         = useState('')
  const [certifications, setCertifications] = useState('')
  const [loading,        setLoading]        = useState(false)
  const [success,        setSuccess]        = useState<{ faceId: string; enrolledAt: string } | null>(null)
  const [error,          setError]          = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!capturedB64) { setError('Please capture a photo first.'); return }
    if (!externalId.trim() || !name.trim()) { setError('Worker ID and Name are required.'); return }

    setLoading(true)
    setError(null)
    try {
      const certs = certifications.split(',').map(s => s.trim()).filter(Boolean)
      const res = await enrollWorker({
        selfie_b64:     capturedB64,
        external_id:    externalId.trim(),
        name:           name.trim(),
        role:           role.trim() || undefined,
        site_id:        siteId.trim() || undefined,
        certifications: certs.length ? certs : undefined,
      })
      setSuccess({ faceId: res.faceId, enrolledAt: res.enrolledAt })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Enroll failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="page">
      <div className="logo">🏗️ SITEGUARD</div>
      <div className="verdict-block AUTHORIZED">
        <div className="verdict-icon">✅</div>
        <div className="verdict-label AUTHORIZED">ENROLLED</div>
        <p style={{ marginTop: 10, fontSize: 14, color: 'var(--grey)' }}>
          Worker <strong style={{ color: 'var(--white)' }}>{name}</strong> added to authorized collection.
        </p>
      </div>
      <div className="card" style={{ width: '100%', marginBottom: 20 }}>
        <div className="metric-row">
          <span className="metric-label">Face ID</span>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--grey)' }}>
            {success.faceId.slice(0, 24)}…
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Enrolled At</span>
          <span style={{ fontSize: 13 }}>{new Date(success.enrolledAt).toLocaleString()}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, width: '100%' }}>
        <button className="btn btn-outline" onClick={() => { setSuccess(null); setCapturedB64(null); setExternalId(''); setName(''); setRole(''); setSiteId(''); setCertifications('') }}>
          Enroll Another
        </button>
        <button className="btn btn-primary" onClick={() => nav('/workers')}>View Registry</button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="logo">🏗️ SITEGUARD</div>
      <h1 className="step-title">Enroll Worker</h1>
      <p className="step-sub">
        Capture the worker's face, then fill in their details.
      </p>

      <div style={{ width: '100%', marginBottom: 24 }}>
        <SelfieCapture
          onCapture={b64 => { setCapturedB64(b64); setError(null) }}
          loading={loading}
          actionLabel="Capture Photo"
        />
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="field">
          <label>Worker ID *</label>
          <input value={externalId} onChange={e => setExternalId(e.target.value)} placeholder="EMP-001" disabled={loading} />
        </div>
        <div className="field">
          <label>Full Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" disabled={loading} />
        </div>
        <div className="field">
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} disabled={loading}>
            <option value="">— Select role —</option>
            <option value="Blasting Technician">Blasting Technician</option>
            <option value="Safety Officer">Safety Officer</option>
            <option value="Electrician">Electrician</option>
            <option value="Operator">Operator</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Contractor">Contractor</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="field">
          <label>Site ID</label>
          <input value={siteId} onChange={e => setSiteId(e.target.value)} placeholder="SITE-A" disabled={loading} />
        </div>
        <div className="field">
          <label>Certifications (comma-separated)</label>
          <input value={certifications} onChange={e => setCertifications(e.target.value)} placeholder="First Aid, Blasting, Safety Officer" disabled={loading} />
        </div>

        {error && <div style={{ color: 'var(--red)', marginBottom: 16, fontSize: 14, textAlign: 'center' }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-outline" onClick={() => nav('/')} disabled={loading}>← Back</button>
          <button type="submit" className="btn btn-success" disabled={loading || !capturedB64}>
            {loading ? 'Enrolling…' : '✅ Enroll Worker'}
          </button>
        </div>
      </form>
    </div>
  )
}
