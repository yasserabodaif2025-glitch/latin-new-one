import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get('token')?.value
  const authenticated = Boolean(token)

  return new Response(JSON.stringify({ authenticated }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}
