import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton for calendar day cell
const DaySkeleton = () => (
  <div className="tw:p-2 tw:min-h-[80px] tw:rounded-lg tw:border tw:border-gray-200 tw:animate-pulse">
    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-full tw:gap-2">
      <div className="tw:h-4 tw:w-4 tw:bg-gray-200 tw:rounded" />
      <div className="tw:h-5 tw:w-10 tw:bg-gray-200 tw:rounded" />
    </div>
  </div>
);

const FlexibleDatesCalendar = ({
  isOpen,
  onClose,
  onDateSelect,
  selectedDate,
  priceData = {},
  isLoading = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const today = startOfDay(new Date());

  // Get price data for a date from props
  const getPriceForDate = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    if (priceData[dateKey]) {
      return priceData[dateKey];
    }
    // Return default if no data
    return {
      price: 0,
      isCheapest: false,
      isRecommended: false,
    };
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date) => {
    if (!isBefore(date, today)) {
      onDateSelect(date);
    }
  };

  const isPastDate = (date) => {
    return isBefore(date, today) && !isSameDay(date, today);
  };

  const daysInMonth = getDaysInMonth();
  const monthYearLabel = format(currentMonth, "MMMM yyyy");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:bg-black/50 tw:backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
            className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:max-w-4xl tw:w-full tw:mx-4 tw:max-h-[90vh] tw:flex tw:flex-col tw:overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="tw:flex tw:items-center tw:justify-between tw:p-6 tw:border-b">
              <h2 className="tw:text-2xl tw:font-semibold tw:text-gray-900">
                Select Flexible Dates
              </h2>
              <button
                onClick={onClose}
                className="tw:p-2 tw:hover:bg-gray-100 tw:rounded-lg tw:transition-colors"
              >
                <X size={24} className="tw:text-gray-500" />
              </button>
            </div>

            {/* Calendar Navigation */}
            <div className="tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-4">
              <button
                onClick={handlePreviousMonth}
                className="tw:p-2 tw:hover:bg-gray-100 tw:rounded-lg tw:transition-colors"
              >
                <ChevronLeft size={20} className="tw:text-gray-600" />
              </button>
              <h3 className="tw:text-lg tw:font-medium tw:text-gray-900">
                {monthYearLabel}
              </h3>
              <button
                onClick={handleNextMonth}
                className="tw:p-2 tw:hover:bg-gray-100 tw:rounded-lg tw:transition-colors"
              >
                <ChevronRight size={20} className="tw:text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="tw:flex-1 tw:px-6 tw:pb-4 tw:overflow-auto">
              {/* Weekday headers */}
              <div className="tw:grid tw:grid-cols-7 tw:gap-1 tw:mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="tw:text-center tw:text-sm tw:font-medium tw:text-gray-600 tw:py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar Days */}
              <div className="tw:grid tw:grid-cols-7 tw:gap-1">
                {daysInMonth.map((date, idx) => {
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const isSelected =
                    selectedDate && isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, today);
                  const isPast = isPastDate(date);
                  const priceInfo = getPriceForDate(date);
                  const isHovered = hoveredDate && isSameDay(date, hoveredDate);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => setHoveredDate(date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      disabled={isPast}
                      className={cn(
                        "tw:relative tw:p-2 tw:min-h-[80px] tw:rounded-lg tw:border tw:transition-all tw:duration-200",
                        {
                          // Base styles
                          "tw:bg-white tw:border-gray-200":
                            !isSelected &&
                            !priceInfo.isCheapest &&
                            !priceInfo.isRecommended,
                          "tw:opacity-40 tw:cursor-not-allowed": isPast,
                          "tw:opacity-30": !isCurrentMonth,
                          "tw:cursor-pointer tw:hover:border-gray-400":
                            !isPast && isCurrentMonth,

                          // Special states
                          "tw:bg-blue-50 tw:border-blue-200":
                            priceInfo.isRecommended && !isSelected,
                          "tw:bg-green-50 tw:border-green-200":
                            priceInfo.isCheapest && !isSelected,
                          "tw:bg-gray-900 tw:border-gray-900 tw:text-white":
                            isSelected,
                          "tw:ring-2 tw:ring-gray-300": isToday && !isSelected,
                          "tw:transform tw:scale-105 tw:shadow-md":
                            isHovered && !isPast,
                        }
                      )}
                    >
                      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-full">
                        <span
                          className={cn("tw:text-sm tw:font-medium tw:mb-1", {
                            "tw:text-gray-900": !isSelected && isCurrentMonth,
                            "tw:text-gray-400": !isCurrentMonth,
                            "tw:text-white": isSelected,
                          })}
                        >
                          {format(date, "d")}
                        </span>
                        {isCurrentMonth && !isPast && priceInfo.price > 0 && (
                          <span
                            className={cn("tw:text-lg tw:font-semibold", {
                              "tw:text-gray-900":
                                !isSelected &&
                                !priceInfo.isCheapest &&
                                !priceInfo.isRecommended,
                              "tw:text-green-600":
                                priceInfo.isCheapest && !isSelected,
                              "tw:text-blue-600":
                                priceInfo.isRecommended && !isSelected,
                              "tw:text-white": isSelected,
                            })}
                          >
                            ${priceInfo.price}
                          </span>
                        )}
                        {/* Indicator dots */}
                        {isCurrentMonth &&
                          !isPast &&
                          (priceInfo.isCheapest || priceInfo.isRecommended) && (
                            <div className="tw:absolute tw:top-1 tw:right-1">
                              <div
                                className={cn("tw:w-2 tw:h-2 tw:rounded-full", {
                                  "tw:bg-green-500": priceInfo.isCheapest,
                                  "tw:bg-blue-500": priceInfo.isRecommended,
                                  "tw:bg-white": isSelected,
                                })}
                              />
                            </div>
                          )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer with Legend */}
            <div className="tw:border-t tw:px-6 tw:py-4 tw:bg-gray-50 tw:rounded-b-2xl">
              <div className="tw:flex tw:items-center tw:justify-center tw:gap-8">
                <div className="tw:flex tw:items-center tw:gap-2">
                  <div className="tw:w-4 tw:h-4 tw:bg-green-500 tw:rounded"></div>
                  <span className="tw:text-sm tw:font-medium tw:text-gray-700">
                    Cheapest
                  </span>
                </div>
                <div className="tw:flex tw:items-center tw:gap-2">
                  <div className="tw:w-4 tw:h-4 tw:bg-blue-500 tw:rounded"></div>
                  <span className="tw:text-sm tw:font-medium tw:text-gray-700">
                    Recommended
                  </span>
                </div>
                <div className="tw:flex tw:items-center tw:gap-2">
                  <div className="tw:w-4 tw:h-4 tw:bg-gray-900 tw:rounded"></div>
                  <span className="tw:text-sm tw:font-medium tw:text-gray-700">
                    Selected
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlexibleDatesCalendar;
