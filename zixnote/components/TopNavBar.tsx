// TopNavBar.js
import { User } from "@supabase/supabase-js";

const TopNavBar = ({ user }: { user: User | null }) => {
  return (
    <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo.png"  // Replace with the path to your logo image
          alt="Logo"
          className="w-8 h-8 mr-2"
        />
        <span className="text-lg font-semibold">Zixnote</span>
      </div>

      {/* Avatar */}
      <div className="flex items-center">
        {user ? (
          <div className="flex items-center mr-4">
            <span className="mr-2">{user.email}</span>
            <img
              src={user?.user_metadata.avatar_url|| "/default-avatar.png"}  // Replace with the path to your default avatar image
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        ) : (
          <a href="/login" className="hover:underline">
            Log In
          </a>
        )}
      </div>
    </div>
  );
};

export default TopNavBar;
