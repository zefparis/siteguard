import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SelfieCapture } from '../components/SelfieCapture'
import { scanWorker, type ScanResult } from '../services/api'

export function Scan() {
  const nav = useNavigate()
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState<ScanResult | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [workerId, setWorkerId] = useState('')
  const [siteId,   setSiteId]   = useState('')

  async function handleCapture(b64: string) {
    setLoading(true)
    setError(null)
    try {
      const { result: r } = await scanWorker({
        selfie_b64: b64,
        worker_id: workerId || undefined,
        site_id: siteId || undefined,
      })
      setResult(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setLoading(false)
    }
  }

  const verdictIcon = { AUTHORIZED: '✅', UNAUTHORIZED: '⚠️', BLACKLISTED: '🚫' }
  const verdictMsg  = {
    AUTHORIZED:   'Worker may enter the site.',
    UNAUTHORIZED: 'Access denied — worker is not enrolled.',
    BLACKLISTED:  'Access denied — worker is blacklisted.',
  }

  return (
    <div className="page">
      <div className="logo">🏗️ SITEGUARD</div>

      {!result ? (
        <>
          <h1 className="step-title">Scan Worker</h1>
          <p className="step-sub">
            Position the worker's face in the frame.<br />
            Tap <strong>Scan</strong> for instant verification.
          </p>

          <div style={{ width: '100%', display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label>Worker ID (optional)</label>
              <input value={workerId} onChange={e => setWorkerId(e.target.value)} placeholder="EMP-001" />
            </div>
            <div style={{ flex: 1 }}>
              <label>Site ID (optional)</label>
              <input value={siteId} onChange={e => setSiteId(e.target.value)} placeholder="SITE-A" />
            </div>
          </div>

          <SelfieCapture onCapture={handleCapture} loading={loading} actionLabel="Scan →" />
          {error && (
            <div style={{ color: 'var(--red)', marginTop: 16, textAlign: 'center', fontSize: 14 }}>
              {error}
            </div>
          )}
          <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => nav('/')}>
            ← Back
          </button>
        </>
      ) : (
        <>
          <div className={`verdict-block ${result.verdict}`}>
            <div className="verdict-icon">{verdictIcon[result.verdict]}</div>
            <div className={`verdict-label ${result.verdict}`}>{result.verdict}</div>
            <p style={{ marginTop: 10, fontSize: 14, color: 'var(--grey)' }}>
              {verdictMsg[result.verdict]}
            </p>
          </div>

          <div className="card" style={{ width: '100%', marginBottom: 16 }}>
            <div className="metric-row">
              <span className="metric-label">Authorized Match</span>
              <span className={`metric-value ${result.authorizedSim != null && result.authorizedSim >= 85 ? 'green' : ''}`}>
                {result.authorizedSim != null ? `${result.authorizedSim.toFixed(1)}%` : '—'}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Blacklist Match</span>
              <span className={`metric-value ${result.blacklistSim != null && result.blacklistSim >= 90 ? 'red' : 'green'}`}>
                {result.blacklistSim != null ? `${result.blacklistSim.toFixed(1)}%` : '—'}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Face Confidence</span>
              <span className="metric-value">{result.faceConfidence.toFixed(1)}%</span>
            </div>
            {result.workerId && (
              <div className="metric-row">
                <span className="metric-label">Worker ID</span>
                <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{result.workerId}</span>
              </div>
            )}
            <div className="metric-row">
              <span className="metric-label">Scan ID</span>
              <span style={{ fontSize: 10, color: 'var(--grey)', fontFamily: 'monospace' }}>
                {result.scanId.slice(0, 18)}…
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn btn-outline" onClick={() => setResult(null)}>
              New Scan
            </button>
            <button className="btn btn-primary" onClick={() => nav('/')}>
              Home
            </button>
          </div>
        </>
      )}
    </div>
  )
}
