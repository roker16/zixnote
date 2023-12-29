import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { FaUserCircle, FaBars } from "react-icons/fa";
import TopNavBar from "@/components/TopNavBar";
import AuthButton from "@/components/AuthButton";
import Avatar from "@/components/Avatar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const Footer = () => {
  return (
    <footer className="bg-gray-200 p-4">
      <div className="container mx-auto text-center">
        <p>
          <a href="/terms" className="mx-2">
            Termsss
          </a>
          |
          <a href="/contact" className="mx-2">
            Contact
          </a>
          |
          <a href="/privacy-policy" className="mx-2">
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  );
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html data-theme="light" lang="en">
      <body >
        <div>
          <TopNavBar user={user} />
          {/* Other content goes here */}
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Main Content</h1>
            {user?.email}
           
            {children}
          </div>
          <Footer />
        </div>
        {/* <main className="min-h-screen flex flex-col items-center">

        </main> */}
      </body>
    </html>
  );
}
