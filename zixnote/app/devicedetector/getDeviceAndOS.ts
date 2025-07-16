"use server";
import { headers } from "next/headers";
import { userAgent } from "next/server";

// Define types for UserAgent
export type UserAgent = {
  device: { type?: string; model?: string; vendor?: string };
  os: { name?: string; version?: string };
  browser: { name?: string; version?: string };
};

// Server-side function to detect device and OS
export async function getDeviceAndOS(): Promise<UserAgent> {
  const headersList = headers();
  const ua = userAgent({ headers: headersList });
  return {
    device: {
      type: ua.device.type || "unknown",
      model: ua.device.model || "unknown",
      vendor: ua.device.vendor || "unknown",
    },
    os: {
      name: ua.os.name || "unknown",
      version: ua.os.version || "unknown",
    },
    browser: {
      name: ua.browser.name || "unknown",
      version: ua.browser.version || "unknown",
    },
  };
}
