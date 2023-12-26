"use client"

import { createClient } from "@/utils/supabase/client"

export default function GoogleSignin() {
    const supabase = createClient()
    const signin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

    }

    return (
        <div >

            <button
                className="btn btn-neutral"
                onClick={() => signin()}
            >
                Google Sign In
            </button>

        </div>
    );
}
