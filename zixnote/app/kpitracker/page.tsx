import { Container, Title } from "@mantine/core";
import Link from "next/link";
import AiDrawerOpensTracker from "./AiDrawerOpensTracker";
import NoteUpdatesTracker from "./NoteUpdatesTracker";

import { getUserAndRole } from "@/utils/getUserAndRole";
import ControlSettings from "./ControlSettings";

export default async function KPIPage() {
  const { role, user } = await getUserAndRole();

  // Check if user is admin
  if (!role?.includes("admin")) {
    return (
      <Container
        size="lg"
        className="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col items-center justify-center"
      >
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xl font-medium text-red-600">Not Authorized</p>
          <p className="text-gray-500 mt-2">
            You need admin privileges to access this page.
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block transition duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container
      size="lg"
      className="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col"
    >
      {/* Home Page Link */}
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 font-semibold mb-4 inline-block transition duration-200"
      >
        ← Back to Home
      </Link>

      <Title
        order={2}
        className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 tracking-tight"
      >
        <span className="text-blue-600 text-4xl">📊</span> KPI Tracker
      </Title>

      {/* User Info Section */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <p className="text-lg font-semibold text-gray-800">
          Role:{" "}
          <span className="text-blue-600 capitalize">{role || "N/A"}</span>
        </p>
        <p className="text-md text-gray-600 mt-1">
          User:{" "}
          <span className="font-medium">
            {user?.user_metadata.full_name || "Unknown"}
          </span>
        </p>
      </div>

      {/* Grid of KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="transition-transform duration-300 hover:scale-105">
          <AiDrawerOpensTracker />
        </div>
        <div className="transition-transform duration-300 hover:scale-105">
          <NoteUpdatesTracker />
        </div>
      </div>

      {/* Control Settings Component */}
      <ControlSettings />
    </Container>
  );
}
