"use client"

import { createClient } from "@/utils/supabase/client"

export default function GoogleSignin() {
    const supabase = createClient()
    const signin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `http://localhost:3000/auth/callback`,
            },
        })

    }

    return (<div>
        <button onClick={() => signin()}>
            Google signIn
        </button>
    </div>
    )
}
