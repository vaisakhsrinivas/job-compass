

## Add PostHog Analytics

PostHog will be integrated as a React provider wrapping the app, using the provided API key and host.

### Steps

1. **Install `posthog-js`** npm package

2. **Create `src/lib/posthog.ts`** — initialize PostHog client with:
   - API key: `phc_ApXNe7tdyHj9PV4uQ999GZPLNvb9JDHD5GYURcJatw6U`
   - Host: `https://us.i.posthog.com`
   - `person_profiles: 'identified_only'`

3. **Create `src/components/PostHogProvider.tsx`** — React provider using `posthog-js/react` that initializes PostHog on mount and provides context to the app

4. **Update `src/App.tsx`** — wrap the app with `PostHogProvider`

5. **Update `src/hooks/useAuth.tsx`** — call `posthog.identify()` on login and `posthog.reset()` on logout to link analytics to authenticated users

### Technical Notes
- The API key is a **publishable key** (client-side), so it's safe to store in the codebase directly — no secrets needed.
- PostHog will automatically capture pageviews and basic events. Custom event tracking can be added later.

