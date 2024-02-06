"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@mantine/core";
import {
  IconBrandGoogle,
  IconBrandGoogleFilled,
  IconBrandGoogleHome,
} from "@tabler/icons-react";

export default function GoogleSignin() {
  const supabase = createClient();
  const signin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div>
      <Button
        variant="default"
        leftSection={<IconBrandGoogleFilled />}
        onClick={() => signin()}
      >
        Google Sign In
      </Button>
    </div>
  );
}
