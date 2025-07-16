"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserAgent } from "./getDeviceAndOS";

// Create context for user agent data
export const UserAgentContext = createContext<UserAgent | undefined>(undefined);

// Client-side hook for device detection based on window size
export function useClientDevice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return isMobile ? "mobile" : "desktop";
}

// Hook to access user agent and client device
export function useDeviceInfo() {
  const userAgent = useContext(UserAgentContext);
  const clientDevice = useClientDevice();

  if (!userAgent) {
    throw new Error(
      "useDeviceInfo must be used within a UserAgentContext.Provider"
    );
  }

  return {
    device: userAgent.device,
    os: userAgent.os,
    browser: userAgent.browser,
    clientDevice,
  };
}

// Client Component to display device and OS info
export function DeviceOSDetector({
  userAgentData,
}: {
  userAgentData: UserAgent;
}) {
  return (
    <UserAgentContext.Provider value={userAgentData}>
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold">Device & OS Info</h2>
        <p>
          <strong>Device Type:</strong> {userAgentData.device.type}
        </p>
        <p>
          <strong>Device Vendor:</strong> {userAgentData.device.vendor}
        </p>
        <p>
          <strong>Device Model:</strong> {userAgentData.device.model}
        </p>
        <p>
          <strong>Operating System:</strong> {userAgentData.os.name}{" "}
          {userAgentData.os.version}
        </p>
        <p>
          <strong>Browser:</strong> {userAgentData.browser.name}{" "}
          {userAgentData.browser.version}
        </p>
        <p>
          <strong>Client Device (via window size):</strong>{" "}
          <ClientDeviceDisplay />
        </p>
      </div>
    </UserAgentContext.Provider>
  );
}

// Helper component to display client device
function ClientDeviceDisplay() {
  const { clientDevice } = useDeviceInfo();
  return <span>{clientDevice}</span>;
}
