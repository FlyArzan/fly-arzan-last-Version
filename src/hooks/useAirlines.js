import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Airline reference lookup for the admin airport form.
 *
 * Backed by the seeded `airline` Prisma table via GET /api/admin/airlines/search.
 * The editor types a name or code; picking a result fills in the 2-letter IATA
 * code, which is what resolves the logo at /logos/<IATA>.png on the public side.
 *
 * Admin-only, so this sends credentials.
 */
export const useAirlineSearch = (query) => {
  const q = (query || "").trim();
  return useQuery({
    queryKey: ["airlines", "search", q],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/airlines/search?q=${encodeURIComponent(q)}`,
        { credentials: "include", headers: { "Content-Type": "application/json" } },
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    },
    // Below two characters the backend returns nothing anyway — don't ask.
    enabled: q.length >= 2,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
    retry: 1,
  });
};
