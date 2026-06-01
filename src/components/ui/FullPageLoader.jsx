/**
 * FullPageLoader — a single, consistent full-viewport loading screen.
 *
 * Used at every transitional step of the user auth/redirect chain (route
 * Suspense fallback → /auth/callback → UserAuthGuard → dashboard) so the user
 * sees ONE stable loading screen instead of several mismatched spinners that
 * jump around. Key details that keep it seamless:
 *   - `fixed inset-0` → always covers the exact viewport, regardless of scroll
 *     position or page content height (no vertical "jump" between steps).
 *   - bg `#f5f5f5` → matches the dashboard background, so the final
 *     loader→content swap is invisible.
 *   - the message line always reserves its height (even when empty), so the
 *     spinner stays pinned in the same spot whether or not text is shown.
 *
 * Note: the admin path intentionally uses its own dark loader (AdminAuthGuard)
 * to match the dark admin theme, so this light loader is for the user path.
 */
const FullPageLoader = ({ message = "" }) => {
  return (
    <div className="tw:fixed tw:inset-0 tw:z-[60] tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:bg-[#f5f5f5]">
      <div className="tw:w-10 tw:h-10 tw:rounded-full tw:border-4 tw:border-gray-200 tw:border-t-[#667eea] tw:animate-spin" />
      <p className="tw:m-0 tw:h-5 tw:text-sm tw:text-gray-500">{message}</p>
    </div>
  );
};

export default FullPageLoader;
