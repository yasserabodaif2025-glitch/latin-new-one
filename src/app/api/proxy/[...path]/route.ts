import { cookies } from 'next/headers'

const serverBase = process.env.API_URL?.replace(/\/+$/, '')

async function forwardRequest(req: Request, params: { path: string[] }) {
  if (!serverBase) {
    return new Response('API_URL not configured', { status: 500 })
  }

  const token = cookies().get('token')?.value

  const url = new URL(req.url)
  const query = url.search || ''
  const path = params.path?.join('/') || ''
  const target = `${serverBase}/${path}${query}`

  const headers: Record<string, string> = {}
  // copy some incoming headers except host
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'host') return
    headers[key] = value
  })

  if (token) {
    headers['authorization'] = `Bearer ${token}`
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    // body will be undefined for GET/HEAD
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer(),
    // keep credentials mode server-side
  }

  const res = await fetch(target, init)

  // Build response and forward status + headers
  const responseHeaders = new Headers()
  res.headers.forEach((v, k) => {
    // avoid problematic hop-by-hop headers
    if (['transfer-encoding', 'connection', 'keep-alive', 'x-powered-by'].includes(k.toLowerCase())) return
    responseHeaders.set(k, v)
  })

  const buffer = await res.arrayBuffer()
  return new Response(buffer, {
    status: res.status,
    headers: responseHeaders,
  })
}

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  return forwardRequest(req, params)
}
export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  return forwardRequest(req, params)
}
export async function PUT(req: Request, { params }: { params: { path: string[] } }) {
  return forwardRequest(req, params)
}
export async function DELETE(req: Request, { params }: { params: { path: string[] } }) {
  return forwardRequest(req, params)
}
export async function PATCH(req: Request, { params }: { params: { path: string[] } }) {
  return forwardRequest(req, params)
}
