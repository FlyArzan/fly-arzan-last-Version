import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePublicCmsPage } from "./useCms";

/**
 * Landing-page FAQ content, CMS-first with a language-safe fallback.
 *
 * The FAQ sections on the flights / hotels / cars landing pages used to read
 * only from src/locales/*\/translation.json, so editing FAQ in the admin panel
 * changed /Faq but never the landing pages. This hook binds them to the CMS.
 *
 * Why it is not simply "always use the CMS": CMS content is authored once, in
 * English. Serving it to every locale would replace 24 professionally
 * translated FAQ sets with English text — a regression for most visitors. So:
 *
 *   1. English visitor + CMS category has items  -> CMS content (admin edits show)
 *   2. Non-English visitor                       -> translated i18n content
 *   3. No CMS category bound for this surface    -> translated i18n content
 *
 * A category is bound to a surface by its `surface` field, set in the admin FAQ
 * editor. Categories saved before that field existed are matched by name, so
 * existing content works without anyone re-saving it.
 */

/** Surfaces an admin can point a FAQ category at. */
export const FAQ_SURFACES = [
  { value: "", label: "Not shown on a landing page" },
  { value: "flights", label: "Flights homepage" },
  { value: "hotels", label: "Hotels page" },
  { value: "cars", label: "Car rentals page" },
];

/** Name fallback for categories saved before `surface` existed. */
const NAME_ALIASES = {
  flights: ["website working", "flights", "flight", "flight booking", "flight bookings"],
  hotels: ["hotel reservations", "hotels", "hotel", "hotel booking"],
  cars: ["car rentals", "cars", "car rental", "car hire"],
};

const isEnglish = (language) =>
  !language || String(language).toLowerCase().startsWith("en");

const normalise = (value) => String(value || "").trim().toLowerCase();

/**
 * @param {"flights"|"hotels"|"cars"} surface
 * @param {Array<{question: string, answer: string}>} translatedFaqs i18n copy
 * @returns {{ faqs: Array<{question: string, answer: string}>, source: string }}
 */
export const useLandingFaq = (surface, translatedFaqs) => {
  const { data } = usePublicCmsPage("faq");
  const { i18n } = useTranslation();
  const language = i18n?.language;

  return useMemo(() => {
    const categories = data?.content?.categories || [];
    const aliases = NAME_ALIASES[surface] || [];

    const category =
      categories.find((c) => normalise(c?.surface) === surface) ||
      categories.find((c) => aliases.includes(normalise(c?.name)));

    const cmsFaqs = (category?.items || [])
      .filter((item) => item?.question)
      .map((item) => ({
        question: item.question,
        answer: item.answer || "",
      }));

    if (cmsFaqs.length && isEnglish(language)) {
      return { faqs: cmsFaqs, source: "cms" };
    }
    return {
      faqs: translatedFaqs || [],
      source: cmsFaqs.length ? "i18n-translated" : "i18n-fallback",
    };
  }, [data, surface, translatedFaqs, language]);
};
