import { headers } from 'next/headers'
 
export async function POST(request: Request) {
  const headersList = headers()
  const referer = headersList.get('referer')
 
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer! },
  })
}