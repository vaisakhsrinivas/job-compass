import { useEffect } from "react";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import posthog, { initPostHog } from "@/lib/posthog";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
