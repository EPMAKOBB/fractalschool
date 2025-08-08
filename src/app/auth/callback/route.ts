// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const searchParams = requestUrl.searchParams
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient();          // <-- await

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(new URL(next, origin))
        }
    }

    console.error('Auth callback error: Could not exchange code for session.')
    return NextResponse.redirect(new URL(`/auth/error?message=Не удалось войти`, origin))
}
