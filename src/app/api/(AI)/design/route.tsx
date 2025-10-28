import { NextResponse } from 'next/server'

const DEFAULT_FASTAPI_BASE_URL = 'http://127.0.0.1:8000'

function getFastAPIBaseUrl(): string {
    const fromEnv = process.env.FASTAPI_BASE_URL
    return (fromEnv && fromEnv.length > 0) ? fromEnv : DEFAULT_FASTAPI_BASE_URL
}

export async function POST(req: Request) {
    try {
        const payload = await req.json()
        const userId: number | undefined = payload.user_id ?? payload.userId

        if (typeof userId !== 'number') {
            return NextResponse.json({ error: 'user_id (number) is required' }, { status: 400 })
        }

        const res = await fetch(`${getFastAPIBaseUrl()}/design/suggest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
            cache: 'no-store',
        })

        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
            return NextResponse.json({ error: data?.detail ?? 'Upstream error' }, { status: res.status })
        }

        return NextResponse.json(data)
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? 'Unexpected error' }, { status: 500 })
    }
}


