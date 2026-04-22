import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWorkers, unenrollWorker } from '../services/api'

export function Workers() {
  const nav = useNavigate()
  const [workers,  setWorkers]  = useState<any[]>([])
  const [siteId,   setSiteId]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error,    setError]    = useState<string | null>(null)

  const load = async (site?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWorkers(site || undefined)
      setWorkers(data.workers)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load workers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRemove = async (faceId: string, name: string) => {
    if (!confirm(`Unenroll ${name}? This removes them from the authorized collection.`)) return
    setRemoving(faceId)
    try {
      await unenrollWorker(faceId)
      setWorkers(w => w.filter(x => x.face_id !== faceId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to unenroll')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div className="logo">🏗️ SITEGUARD</div>
      <h1 className="step-title">Worker Registry</h1>
      <p className="step-sub">Enrolled workers authorized to enter sites</p>

      <div style={{ width: '100%', display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label>Filter by Site ID</label>
          <input value={siteId} onChange={e => setSiteId(e.target.value)} placeholder="All sites" />
        </div>
        <button className="btn btn-outline" style={{ width: 'auto', padding: '12px 20px' }} onClick={() => load(siteId)}>Filter</button>
        <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 20px' }} onClick={() => nav('/enroll')}>+ Enroll</button>
      </div>

      {error && <div style={{ color: 'var(--red)', marginBottom: 16, fontSize: 14, width: '100%', textAlign: 'center' }}>{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--grey)' }}>Loading…</p>
      ) : workers.length === 0 ? (
        <div className="card" style={{ width: '100%', textAlign: 'center' }}>
          <p style={{ color: 'var(--grey)' }}>No enrolled workers found.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => nav('/enroll')}>Enroll First Worker</button>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {workers.map(w => (
            <div key={w.face_id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{w.name}</div>
                <div style={{ fontSize: 12, color: 'var(--grey)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span>ID: {w.external_id}</span>
                  {w.role && <span>Role: {w.role}</span>}
                  {w.site_id && <span>Site: {w.site_id}</span>}
                </div>
                {Array.isArray(w.certifications) && w.certifications.length > 0 && (
                  <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {w.certifications.map((c: string) => (
                      <span key={c} className="badge badge-green" style={{ marginBottom: 0, fontSize: 10 }}>{c}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="btn btn-danger"
                style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
                disabled={removing === w.face_id}
                onClick={() => handleRemove(w.face_id, w.name)}
              >
                {removing === w.face_id ? '…' : 'Unenroll'}
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-outline" style={{ marginTop: 24 }} onClick={() => nav('/')}>← Back</button>
    </div>
  )
}
