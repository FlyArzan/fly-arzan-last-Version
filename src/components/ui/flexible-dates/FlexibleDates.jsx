import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { useRegionalSettings } from "@/context/RegionalSettingsContext";
import PropTypes from "prop-types";

// Skeleton component for loading state
const DateSkeleton = () => (
  <div className="tw:snap-center tw:basis-[100px] tw:shrink-0 tw:flex tw:flex-col tw:justify-center tw:gap-2 tw:py-[24px] tw:px-[20px] tw:grow tw:text-center tw:h-[93px] tw:animate-pulse">
    <div className="tw:h-4 tw:bg-gray-200 tw:rounded tw:w-16 tw:mx-auto" />
    <div className="tw:h-6 tw:bg-gray-200 tw:rounded tw:w-12 tw:mx-auto" />
  </div>
);

const FlexibleDates = ({
  flexibleDates,
  selectedFlexibleDate,
  handleFlexibleDateClick,
  setIsCalendarOpen,
  isLoading = false,
}) => {
  const { convertPrice, selectedCurrencySymbol } = useRegionalSettings();

  // Format price with currency conversion
  const formatPrice = (priceValue) => {
    if (!priceValue) return "-";
    const converted = convertPrice(priceValue);
    return `${selectedCurrencySymbol}${converted}`;
  };
  return (
    <div className="container tw:flex tw:items-center tw:gap-[10px]">
      <div className="tw:flex tw:items-center tw:snap-x tw:overflow-x-auto tw:scrollbar-hide tw:shadow tw:grow tw:divide-x tw:divide-muted tw:bg-white tw:rounded-xl">
        {isLoading ? (
          // Show skeleton loading
          <>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <DateSkeleton key={i} />
            ))}
          </>
        ) : flexibleDates.length > 0 ? (
          flexibleDates.map((date) => (
            <label
              key={date.id}
              className={cn(
                "tw:snap-center tw:basis-[100px] tw:shrink-0 tw:!flex tw:flex-col tw:justify-center tw:gap-1 tw:!py-[24px] tw:!px-[20px] tw:!mb-0 tw:cursor-pointer tw:grow tw:text-center tw:h-[93px] tw:first:rounded-l-xl tw:last:rounded-r-xl tw:relative",
                selectedFlexibleDate === date.id && "tw:bg-primary",
                date.isCheapest &&
                  selectedFlexibleDate !== date.id &&
                  "tw:bg-green-50",
                date.isRecommended &&
                  selectedFlexibleDate !== date.id &&
                  "tw:bg-blue-50"
              )}
              onClick={() => handleFlexibleDateClick(date.id)}
            >
              {/* Indicator for cheapest/recommended */}
              {(date.isCheapest || date.isRecommended) && (
                <div className="tw:absolute tw:top-2 tw:right-2">
                  <div
                    className={cn(
                      "tw:w-2 tw:h-2 tw:rounded-full",
                      date.isCheapest && "tw:bg-green-500",
                      date.isRecommended && "tw:bg-blue-500"
                    )}
                  />
                </div>
              )}
              <span
                className={cn(
                  "tw:text-[14px] tw:font-medium tw:text-secondary",
                  selectedFlexibleDate === date.id && "tw:text-white"
                )}
              >
                {date.date}
              </span>
              <span
                className={cn(
                  "tw:text-[20px] tw:font-semibold",
                  selectedFlexibleDate === date.id && "tw:text-white",
                  selectedFlexibleDate !== date.id &&
                    date.isCheapest &&
                    "tw:text-green-600",
                  selectedFlexibleDate !== date.id &&
                    date.isRecommended &&
                    "tw:text-blue-600",
                  selectedFlexibleDate !== date.id &&
                    !date.isCheapest &&
                    !date.isRecommended &&
                    "tw:text-primary"
                )}
              >
                {formatPrice(date.priceValue)}
              </span>
            </label>
          ))
        ) : (
          // No data available
          <div className="tw:flex tw:items-center tw:justify-center tw:w-full tw:h-[93px] tw:text-gray-500 tw:text-sm">
            No price data available
          </div>
        )}
      </div>
      <button
        onClick={() => setIsCalendarOpen(true)}
        className="tw:!rounded-xl tw:hidden tw:bg-white tw:shadow tw:md:flex tw:flex-col tw:items-center tw:gap-2 tw:!py-[24px] tw:!px-[20px] tw:h-[93px] tw:shrink-0 tw:hover:shadow-lg tw:transition-shadow tw:cursor-pointer"
      >
        <CalendarDays size={20} className="tw:text-secondary tw:shrink-0" />
        <span className="tw:text-[14px] tw:font-medium">Flexible Dates</span>
      </button>
    </div>
  );
};

FlexibleDates.propTypes = {
  flexibleDates: PropTypes.array.isRequired,
  selectedFlexibleDate: PropTypes.number,
  handleFlexibleDateClick: PropTypes.func.isRequired,
  setIsCalendarOpen: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default FlexibleDates;
