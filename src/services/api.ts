const API    = import.meta.env.VITE_API_URL || 'https://hybrid-vector-api.fly.dev'
const TENANT  = import.meta.env.VITE_TENANT_ID
const API_KEY = import.meta.env.VITE_HV_API_KEY

const headers = () => {
  if (!API_KEY) throw new Error('Missing VITE_HV_API_KEY')
  if (!TENANT)  throw new Error('Missing VITE_TENANT_ID')
  return {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  }
}

export type Verdict = 'AUTHORIZED' | 'UNAUTHORIZED' | 'BLACKLISTED'

export interface ScanResult {
  scanId: string
  verdict: Verdict
  access: boolean
  authorizedSim: number | null
  blacklistSim:  number | null
  faceConfidence: number
  timestamp: string
  workerId: string | null
  siteId: string | null
}

export async function scanWorker(payload: {
  selfie_b64: string
  worker_id?: string
  site_id?: string
}): Promise<{ success: boolean; result: ScanResult }> {
  const res = await fetch(`${API}/siteguard/scan`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...payload, tenant_id: TENANT }),
  })
  if (!res.ok) throw new Error(`Scan failed: ${res.status}`)
  return res.json()
}

export async function enrollWorker(payload: {
  selfie_b64: string
  external_id: string
  name: string
  role?: string
  site_id?: string
  certifications?: string[]
}): Promise<{ success: boolean; faceId: string; enrolledAt: string }> {
  const res = await fetch(`${API}/siteguard/enroll`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...payload, tenant_id: TENANT }),
  })
  if (!res.ok) throw new Error(`Enroll failed: ${res.status}`)
  return res.json()
}

export async function unenrollWorker(faceId: string): Promise<{ success: boolean; faceId: string }> {
  const res = await fetch(`${API}/siteguard/enroll/${faceId}`, {
    method: 'DELETE',
    headers: headers(),
  })
  if (!res.ok) throw new Error(`Unenroll failed: ${res.status}`)
  return res.json()
}

export async function blacklistPerson(payload: {
  selfie_b64: string
  external_id: string
  reason: string
  operator: string
}): Promise<{ success: boolean; faceId: string; bannedAt: string }> {
  const res = await fetch(`${API}/siteguard/blacklist`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...payload, tenant_id: TENANT }),
  })
  if (!res.ok) throw new Error(`Blacklist failed: ${res.status}`)
  return res.json()
}

export async function removeBlacklist(faceId: string): Promise<{ success: boolean; faceId: string }> {
  const res = await fetch(`${API}/siteguard/blacklist/${faceId}`, {
    method: 'DELETE',
    headers: headers(),
  })
  if (!res.ok) throw new Error(`Remove failed: ${res.status}`)
  return res.json()
}

export async function getWorkers(siteId?: string, limit = 100): Promise<{ success: boolean; workers: any[] }> {
  const url = new URL(`${API}/siteguard/workers`)
  if (siteId) url.searchParams.set('site_id', siteId)
  url.searchParams.set('limit', limit.toString())
  const res = await fetch(url.toString(), { headers: headers() })
  if (!res.ok) throw new Error(`Workers failed: ${res.status}`)
  return res.json()
}

export async function getBlacklist(limit = 100): Promise<{ success: boolean; blacklist: any[] }> {
  const url = new URL(`${API}/siteguard/blacklist`)
  url.searchParams.set('limit', limit.toString())
  const res = await fetch(url.toString(), { headers: headers() })
  if (!res.ok) throw new Error(`Blacklist failed: ${res.status}`)
  return res.json()
}

export async function getEvents(verdict?: string, siteId?: string, limit = 50): Promise<{ success: boolean; events: any[] }> {
  const url = new URL(`${API}/siteguard/events`)
  if (verdict) url.searchParams.set('verdict', verdict)
  if (siteId)  url.searchParams.set('site_id', siteId)
  url.searchParams.set('limit', limit.toString())
  const res = await fetch(url.toString(), { headers: headers() })
  if (!res.ok) throw new Error(`Events failed: ${res.status}`)
  return res.json()
}

export async function getStatus(): Promise<{
  success: boolean
  authorizedCollection: string
  blacklistCollection: string
  authorizedCount: number
  blacklistCount: number
  authorizedThreshold: number
  blacklistThreshold: number
  awsRegion: string
}> {
  const res = await fetch(`${API}/siteguard/status`, { headers: headers() })
  if (!res.ok) throw new Error(`Status failed: ${res.status}`)
  return res.json()
}
