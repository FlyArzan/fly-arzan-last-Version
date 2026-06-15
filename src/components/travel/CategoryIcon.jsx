import {
  Newspaper,
  PenLine,
  Lightbulb,
  MessageSquare,
  ClipboardList,
  Building2,
  Map,
  Plane,
  Luggage,
  ShieldAlert,
  FileText,
  Info,
  Compass,
} from "lucide-react";

/**
 * Maps an article-category slug to a real Lucide icon (no emoji), so the
 * Travel Hub, category pages and article sidebars share one consistent,
 * on-brand icon set.
 */
const ICONS = {
  "travel-news": Newspaper,
  "travel-blogs": PenLine,
  "travel-tips": Lightbulb,
  "travel-feedback": MessageSquare,
  "travel-guidelines": ClipboardList,
  "airport-guides": Building2,
  "destination-guides": Map,
  "flight-booking-tips": Plane,
  "baggage-information": Luggage,
  "travel-restrictions": ShieldAlert,
  "visa-travel-documents": FileText,
  "general-travel-advice": Info,
};

const CategoryIcon = ({ slug, className = "tw:w-5 tw:h-5", ...props }) => {
  const Icon = ICONS[slug] || Compass;
  return <Icon className={className} aria-hidden="true" {...props} />;
};

export default CategoryIcon;
