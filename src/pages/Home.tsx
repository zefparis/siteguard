import { useNavigate } from 'react-router-dom'
import { InstallAppCard } from '../components/InstallAppCard'

export function Home() {
  const nav = useNavigate()

  return (
    <div className="page">
      <div className="logo">🏗️ SITEGUARD</div>
      <h1 className="step-title" style={{ fontSize: 30, marginBottom: 8 }}>Site Access Control</h1>
      <p className="step-sub">
        Biometric access control for mines, construction and industrial sites.<br />
        Powered by Hybrid Vector — 3 French patents.
      </p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => nav('/scan')}>
          <div className="badge badge-amber">Live Scan</div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>Scan Worker</h2>
          <p style={{ fontSize: 13, color: 'var(--grey)', lineHeight: 1.6 }}>
            Instant biometric verification at site entry.<br />
            Returns AUTHORIZED · UNAUTHORIZED · BLACKLISTED verdict.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 20 }}>
            Start Scan →
          </button>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => nav('/enroll')}>
          <div className="badge badge-green">Register</div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>Enroll Worker</h2>
          <p style={{ fontSize: 13, color: 'var(--grey)', lineHeight: 1.6 }}>
            Register a worker into the authorized collection.<br />
            Capture photo, assign role, site and certifications.
          </p>
          <button className="btn btn-success" style={{ marginTop: 20 }}>
            Enroll Worker →
          </button>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => nav('/workers')}>
          <div className="badge badge-blue">Registry</div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>Worker Registry</h2>
          <p style={{ fontSize: 13, color: 'var(--grey)', lineHeight: 1.6 }}>
            View all enrolled workers with role, site and certifications.<br />
            Remove workers when access is revoked.
          </p>
          <button className="btn btn-blue" style={{ marginTop: 20 }}>
            View Registry →
          </button>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => nav('/blacklist')}>
          <div className="badge badge-red">Blacklist</div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>Blacklist</h2>
          <p style={{ fontSize: 13, color: 'var(--grey)', lineHeight: 1.6 }}>
            Add and manage individuals banned from all sites.<br />
            Safety violations, trespassers, dismissed workers.
          </p>
          <button className="btn btn-danger" style={{ marginTop: 20 }}>
            Manage Blacklist →
          </button>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => nav('/events')}>
          <div className="badge badge-blue">Events</div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>Event Log</h2>
          <p style={{ fontSize: 13, color: 'var(--grey)', lineHeight: 1.6 }}>
            Browse scan history and filter by verdict or site.<br />
            Full audit trail for safety compliance.
          </p>
          <button className="btn btn-outline" style={{ marginTop: 20 }}>
            View Events →
          </button>
        </div>
      </div>

      <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['AWS Rekognition', 'GDPR Compliant', 'Mine Health & Safety', 'ML-KEM FIPS 203'].map(t => (
          <span key={t} className="badge badge-amber">{t}</span>
        ))}
      </div>

      <InstallAppCard appName="SiteGuard" badgeClassName="badge badge-amber" />
    </div>
  )
}
