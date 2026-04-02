import posthog from "posthog-js";

export const POSTHOG_KEY = "phc_ApXNe7tdyHj9PV4uQ999GZPLNvb9JDHD5GYURcJatw6U";
export const POSTHOG_HOST = "https://us.i.posthog.com";

export function initPostHog() {
  if (typeof window !== "undefined" && !posthog.__loaded) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
  return posthog;
}

export default posthog;
