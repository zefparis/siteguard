import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvents } from '../services/api'
import type { Verdict } from '../services/api'

export function Events() {
  const nav = useNavigate()
  const [events,  setEvents]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [verdict, setVerdict] = useState('')
  const [siteId,  setSiteId]  = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEvents(verdict || undefined, siteId || undefined, 100)
      setEvents(data.events)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const verdictBadge: Record<Verdict, string> = {
    AUTHORIZED:   'badge-green',
    UNAUTHORIZED: 'badge-amber',
    BLACKLISTED:  'badge-red',
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div className="logo">🏗️ SITEGUARD</div>
      <h1 className="step-title">Event Log</h1>
      <p className="step-sub">Full audit trail of site access scans</p>

      <div style={{ width: '100%', display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label>Verdict</label>
          <select value={verdict} onChange={e => setVerdict(e.target.value)}>
            <option value="">All</option>
            <option value="AUTHORIZED">AUTHORIZED</option>
            <option value="UNAUTHORIZED">UNAUTHORIZED</option>
            <option value="BLACKLISTED">BLACKLISTED</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label>Site ID</label>
          <input value={siteId} onChange={e => setSiteId(e.target.value)} placeholder="All sites" />
        </div>
        <button className="btn btn-outline" style={{ width: 'auto', padding: '12px 20px' }} onClick={load}>Filter</button>
      </div>

      {error && <div style={{ color: 'var(--red)', marginBottom: 16, fontSize: 14, width: '100%', textAlign: 'center' }}>{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--grey)' }}>Loading…</p>
      ) : events.length === 0 ? (
        <div className="card" style={{ width: '100%', textAlign: 'center' }}>
          <p style={{ color: 'var(--grey)' }}>No events found.</p>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {events.map((ev, i) => (
            <div key={ev.id ?? i} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className={`badge ${verdictBadge[ev.verdict as Verdict] ?? 'badge-blue'}`} style={{ marginBottom: 0 }}>
                  {ev.verdict}
                </span>
                <span style={{ fontSize: 11, color: 'var(--grey)' }}>
                  {new Date(ev.created_at ?? ev.timestamp).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--grey)', flexWrap: 'wrap' }}>
                {ev.worker_id && <span>Worker: <strong style={{ color: 'var(--white)' }}>{ev.worker_id}</strong></span>}
                {ev.site_id   && <span>Site: <strong style={{ color: 'var(--white)' }}>{ev.site_id}</strong></span>}
                {ev.authorized_similarity != null && (
                  <span>Auth: <strong style={{ color: 'var(--green)' }}>{Number(ev.authorized_similarity).toFixed(1)}%</strong></span>
                )}
                {ev.blacklist_similarity != null && (
                  <span>BL: <strong style={{ color: 'var(--red)' }}>{Number(ev.blacklist_similarity).toFixed(1)}%</strong></span>
                )}
                {ev.face_confidence != null && <span>Conf: {Number(ev.face_confidence).toFixed(0)}%</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-outline" style={{ marginTop: 24 }} onClick={() => nav('/')}>← Back</button>
    </div>
  )
}
