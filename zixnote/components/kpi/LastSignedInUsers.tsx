// app/dashboard/LastSignedInUsers.tsx
import { createClient } from "@/utils/supabase/server";

export default async function LastSignedInUsers() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await (await supabase).auth.getUser();

  if (error || !user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      {JSON.stringify(user)}
      <p>User ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>
        Last Sign-In:{" "}
        {user.last_sign_in_at
          ? new Date(user.last_sign_in_at).toLocaleString()
          : "Unknown"}
      </p>
    </div>
  );
}
