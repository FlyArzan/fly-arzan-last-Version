import { IoSearchOutline } from "react-icons/io5";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@/components/ui/combobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { GiCommercialAirplane } from "react-icons/gi";
import { Minus, Plus, Trash, X } from "lucide-react";
import Calendar from "../../calendar";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { MultiCityFormSchema } from "@/schema/multi-city-schema";
import { formatDateForURL } from "@/lib/flight-utils";
import { useCityLocation } from "@/hooks/useCityLocation";
import { useDebounceValue, useSessionStorage } from "usehooks-ts";
import { useRegionalSettings } from "../../../../context/RegionalSettingsContext";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { logSearchEvent } from "@/lib/analytics";

// SegmentRow component moved outside to avoid hook violations
const SegmentRow = memo(
  ({
    segmentIndex,
    segments,
    setValue,
    fields,
    removeSegment,
    isSubmitting,
  }) => {
    const [queryFrom, setQueryFrom] = useState("");
    const [queryTo, setQueryTo] = useState("");
    const [dateOpen, setDateOpen] = useState(false);
    const [tempDepart, setTempDepart] = useState(
      segments[segmentIndex]?.depart || undefined
    );

    const [debouncedQueryFrom] = useDebounceValue(queryFrom, 600);
    const [debouncedQueryTo] = useDebounceValue(queryTo, 600);

    const { data: cityFromData, isLoading: isLoadingFrom } =
      useCityLocation(debouncedQueryFrom);
    const { data: cityToData, isLoading: isLoadingTo } =
      useCityLocation(debouncedQueryTo);

    const cityFromOptions = cityFromData?.data || [];
    const cityToOptions = cityToData?.data || [];
    const currentSegment = segments[segmentIndex];

    const handleDateClose = useCallback(() => {
      setDateOpen(false);
    }, []);

    return (
      <div className="tw:flex tw:flex-col tw:lg:flex-row">
        <div className="tw:order-2 tw:lg:order-0 tw:flex tw:flex-col tw:sm:flex-row tw:items-center tw:sm:space-x-4 tw:space-y-4 tw:lg:space-y-4 tw:sm:space-y-0 tw:w-full">
          {/* From Input */}
          <Combobox
            value={currentSegment?.from || { city: "", iataCode: "" }}
            onChange={(value) =>
              setValue(`segments.${segmentIndex}.from`, value)
            }
            onClose={() => setQueryFrom("")}
          >
            <div className="tw:relative tw:z-40 tw:w-full">
              <ComboboxInput
                id={`from-${segmentIndex}`}
                name={`segments.${segmentIndex}.from`}
                displayValue={(data) =>
                  data?.city ? (data.iataCode ? `${data.city} (${data.iataCode})` : data.city) : ""
                }
                onChange={(event) => setQueryFrom(event.target.value)}
                placeholder="From"
                aria-labelledby={`from-label-${segmentIndex}`}
                className="tw:peer tw:py-[10px] tw:px-5 tw:h-[62px] tw:block tw:w-full tw:border tw:!border-muted tw:text-[15px] tw:!font-semibold tw:rounded-lg tw:placeholder:text-transparent tw:focus:border-primary tw:focus-visible:tw:border-primary tw:focus-visible:outline-hidden tw:focus:ring-primary tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:focus:pt-6 tw:focus:pb-2 tw:not-placeholder-shown:pt-6 tw:not-placeholder-shown:pb-2 tw:autofill:pt-6 tw:autofill:pb-2 tw:focus-visible:ring-0"
              />
              <label
                id={`from-label-${segmentIndex}`}
                htmlFor={`from-${segmentIndex}`}
                className="tw:absolute tw:top-0 tw:start-0 tw:h-full tw:!p-[14px_20.5px] tw:text-[20px] tw:text-secondary tw:truncate tw:pointer-events-none tw:transition tw:ease-in-out tw:duration-100 tw:border tw:border-transparent tw:origin-[0_0] tw:peer-disabled:opacity-50 tw:peer-disabled:pointer-events-none tw:peer-focus:scale-80 tw:peer-focus:translate-x-0.5 tw:peer-focus:-translate-y-1.5 tw:peer-focus:text-secondary tw:peer-not-placeholder-shown:scale-80 tw:peer-not-placeholder-shown:translate-x-0.5 tw:peer-not-placeholder-shown:-translate-y-1.5 tw:peer-not-placeholder-shown:text-secondary"
              >
                From
              </label>
              <ComboboxOptions className="tw:w-[var(--input-width)] tw:sm:w-full tw:sm:!max-w-[400px]">
                {isLoadingFrom && (
                  <div className="tw:p-2 tw:text-center tw:text-sm tw:w-full">
                    Loading...
                  </div>
                )}
                {!isLoadingFrom && cityFromOptions.length === 0 && (
                  <div className="tw:p-2 tw:text-center tw:text-sm tw:text-secondary tw:w-full">
                    No results found.
                  </div>
                )}
                {cityFromOptions.map((data, index) => (
                  <ComboboxOption
                    key={index}
                    value={{ city: data.city, iataCode: data.iataCode }}
                    className="tw:flex"
                  >
                    <div className="tw:flex tw:justify-start tw:gap-2.5 tw:w-full">
                      <GiCommercialAirplane
                        size={20}
                        className="tw:text-secondary tw:!shrink-0 tw:mt-1"
                      />
                      <div className="tw:flex tw:flex-col">
                        <div className="tw:truncate">
                          {data.city} ({data.iataCode})
                        </div>
                        <div className="tw:text-secondary tw:text-sm tw:truncate">
                          {data.airport} ({data.country})
                        </div>
                      </div>
                    </div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>

          {/* To Input */}
          <Combobox
            value={currentSegment?.to || { city: "", iataCode: "" }}
            onChange={(value) => setValue(`segments.${segmentIndex}.to`, value)}
            onClose={() => setQueryTo("")}
          >
            <div className="tw:relative tw:w-full">
              <ComboboxInput
                id={`to-${segmentIndex}`}
                name={`segments.${segmentIndex}.to`}
                displayValue={(data) =>
                  data?.city ? (data.iataCode ? `${data.city} (${data.iataCode})` : data.city) : ""
                }
                onChange={(event) => setQueryTo(event.target.value)}
                placeholder="To"
                aria-labelledby={`to-label-${segmentIndex}`}
                className="tw:peer tw:py-[10px] tw:px-5 tw:h-[62px] tw:block tw:w-full tw:border tw:!border-muted tw:text-[15px] tw:!font-semibold tw:rounded-lg tw:placeholder:text-transparent tw:focus:border-primary tw:focus-visible:tw:border-primary tw:focus-visible:outline-hidden tw:focus:ring-primary tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:focus:pt-6 tw:focus:pb-2 tw:not-placeholder-shown:pt-6 tw:not-placeholder-shown:pb-2 tw:autofill:pt-6 tw:autofill:pb-2 tw:focus-visible:ring-0"
              />
              <label
                id={`to-label-${segmentIndex}`}
                htmlFor={`to-${segmentIndex}`}
                className="tw:absolute tw:top-0 tw:start-0 tw:h-full tw:!p-[14px_20.5px] tw:text-[20px] tw:text-secondary tw:truncate tw:pointer-events-none tw:transition tw:ease-in-out tw:duration-100 tw:border tw:border-transparent tw:origin-[0_0] tw:peer-disabled:opacity-50 tw:peer-disabled:pointer-events-none tw:peer-focus:scale-80 tw:peer-focus:translate-x-0.5 tw:peer-focus:-translate-y-1.5 tw:peer-focus:text-secondary tw:peer-not-placeholder-shown:scale-80 tw:peer-not-placeholder-shown:translate-x-0.5 tw:peer-not-placeholder-shown:-translate-y-1.5 tw:peer-not-placeholder-shown:text-secondary"
              >
                To
              </label>
              <ComboboxOptions className="tw:w-[var(--input-width)] tw:sm:w-full tw:sm:!max-w-[400px]">
                {isLoadingTo && (
                  <div className="tw:p-2 tw:text-center tw:text-sm tw:w-full">
                    Loading...
                  </div>
                )}
                {!isLoadingTo && cityToOptions.length === 0 && (
                  <div className="tw:p-2 tw:text-center tw:text-sm tw:text-secondary tw:w-full">
                    No results found.
                  </div>
                )}
                {cityToOptions.map((data, index) => (
                  <ComboboxOption
                    key={index}
                    value={{ city: data.city, iataCode: data.iataCode }}
                    className="tw:flex"
                  >
                    <div className="tw:flex tw:justify-start tw:gap-2.5 tw:w-full">
                      <GiCommercialAirplane
                        size={20}
                        className="tw:text-secondary tw:!shrink-0 tw:mt-1"
                      />
                      <div className="tw:flex tw:flex-col">
                        <div className="tw:truncate">
                          {data.city} ({data.iataCode})
                        </div>
                        <div className="tw:text-secondary tw:text-sm tw:truncate">
                          {data.airport} ({data.country})
                        </div>
                      </div>
                    </div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>

          {/* Date Input */}
          <Popover
            open={dateOpen}
            onOpenChange={setDateOpen}
            className="tw:w-full tw:lg:mr-0 tw:mb-0 tw:lg:mb-auto"
          >
            <PopoverTrigger>
              <input
                id={`depart-${segmentIndex}`}
                name={`segments.${segmentIndex}.depart`}
                type="text"
                className="tw:peer tw:py-[10px] tw:px-5 tw:h-[62px] tw:block tw:w-full tw:border tw:!border-muted tw:text-[15px] tw:!font-semibold tw:rounded-lg tw:placeholder:text-transparent tw:focus:border-primary tw:focus-visible:tw:border-primary tw:focus-visible:outline-hidden tw:focus:ring-primary tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:focus:pt-6 tw:focus:pb-2 tw:not-placeholder-shown:pt-6 tw:not-placeholder-shown:pb-2 tw:autofill:pt-6 tw:autofill:pb-2 tw:focus-visible:ring-0 tw:read-only:cursor-default tw:select-none"
                placeholder="Depart"
                aria-labelledby={`depart-label-${segmentIndex}`}
                value={
                  currentSegment?.depart instanceof Date
                    ? currentSegment.depart.toLocaleDateString()
                    : ""
                }
                readOnly
              />
              <label
                id={`depart-label-${segmentIndex}`}
                htmlFor={`depart-${segmentIndex}`}
                className="tw:absolute tw:top-0 tw:start-0 tw:h-full tw:!p-[14px_20.5px] tw:text-[20px] tw:text-secondary tw:truncate tw:pointer-events-none tw:transition tw:ease-in-out tw:duration-100 tw:border tw:border-transparent tw:origin-[0_0] tw:peer-disabled:opacity-50 tw:peer-disabled:pointer-events-none tw:peer-not-placeholder-shown:scale-80 tw:peer-not-placeholder-shown:translate-x-0.5 tw:peer-not-placeholder-shown:-translate-y-1.5 tw:peer-not-placeholder-shown:text-secondary"
              >
                Depart
              </label>
            </PopoverTrigger>
            <PopoverContent
              mobileTitle="Select date"
              footer={
                <div className="tw:grid tw:grid-cols-2 tw:gap-2 md:tw:flex md:tw:justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setTempDepart(undefined);
                    }}
                    className="tw:w-full md:tw:w-auto tw:px-6 tw:py-2 tw:flex tw:items-center tw:justify-center tw:bg-muted/50 tw:hover:bg-muted tw:transition tw:!rounded tw:duration-100 tw:font-medium"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue(`segments.${segmentIndex}.depart`, tempDepart);
                      handleDateClose();
                    }}
                    className="tw:w-full md:tw:w-auto tw:px-6 tw:py-2 tw:flex tw:items-center tw:justify-center tw:bg-primary tw:!text-white tw:hover:bg-primary/80 tw:transition tw:!rounded tw:duration-100 tw:font-medium"
                  >
                    Apply
                  </button>
                </div>
              }
            >
              <Calendar
                mode="single"
                selected={tempDepart}
                onSelect={(d) => setTempDepart(d)}
                disabled={{ before: new Date() }}
              />
              {/* Apply & Reset Button (desktop only) */}
              <div className="tw:hidden md:tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempDepart(undefined);
                  }}
                  className="tw:px-6 tw:py-2 tw:flex tw:items-center tw:justify-center tw:bg-muted/50 tw:hover:bg-muted tw:transition tw:!rounded tw:duration-100 tw:font-medium"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue(`segments.${segmentIndex}.depart`, tempDepart);
                    handleDateClose();
                  }}
                  className="tw:px-6 tw:py-2 tw:flex tw:items-center tw:justify-center tw:bg-primary tw:!text-white tw:hover:bg-primary/80 tw:transition tw:!rounded tw:duration-100 tw:font-medium"
                >
                  Apply
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            "tw:flex tw:justify-between tw:items-end tw:gap-4 tw:lg:!mb-4 tw:lg:!mt-0 tw:!mb-4",
            {}
          )}
        >
          <p className="tw:text-base tw:font-medium tw:lg:hidden">
            Flight {segmentIndex + 1}
          </p>
          <button
            type="button"
            aria-label={`Remove segment ${segmentIndex + 1}`}
            onClick={() => removeSegment(segmentIndex)}
            className={cn(
              "tw:lg:!ml-4 tw:!ml-auto tw:lg:!mt-0 tw:lg:px-5 tw:lg:h-[62px] tw:shrink-0 tw:2xl:px-0 tw:2xl:!w-[62px] tw:lg:bg-red-400 tw:!text-gray-500 tw:lg:!text-white tw:hover:bg-red-400/80 tw:!rounded-lg tw:items-center tw:flex tw:justify-center tw:gap-2",
              fields.length === 2 && "tw:lg:hidden tw:opacity-50"
            )}
            disabled={isSubmitting}
          >
            <X size={28} />
          </button>
        </div>
      </div>
    );
  }
);

SegmentRow.propTypes = {
  segmentIndex: PropTypes.number.isRequired,
  segments: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  addSegment: PropTypes.func.isRequired,
  removeSegment: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

SegmentRow.displayName = "SegmentRow";

const MultiCityForm = ({ initialValues, onSearch }) => {
  const navigate = useNavigate();
  const { regionalSettings } = useRegionalSettings();
  const [travellersOpen, setTravellersOpen] = useState(false);
  const [appliedTravellers, setAppliedTravellers] = useState(
    initialValues?.travellers ? { ...initialValues.travellers } : null
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(MultiCityFormSchema),
    defaultValues: {
      segments: initialValues?.segments || [
        {
          from: { city: "", iataCode: "" },
          to: { city: "", iataCode: "" },
          depart: "",
        },
        {
          from: { city: "", iataCode: "" },
          to: { city: "", iataCode: "" },
          depart: "",
        },
      ],
      travellers: {
        cabin: initialValues?.travellers?.cabin || "economy",
        adults: initialValues?.travellers?.adults ?? 1,
        children: initialValues?.travellers?.children ?? 0,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "segments",
  });

  const formValues = watch();
  const { segments, travellers } = formValues;

  // Use session storage to persist form data
  const [, setSessionData] = useSessionStorage("selected-flight", {});

  // Memoized cabin label mapping
  const cabinLabelMap = useMemo(
    () => ({
      economy: "Economy",
      premium_economy: "Premium Economy",
      business: "Business",
      first_class: "First Class",
    }),
    []
  );

  // Memoized travellers summary to prevent unnecessary recalculations
  const travellersSummary = useMemo(() => {
    if (!appliedTravellers) return "";
    const totalTravellers =
      appliedTravellers.adults + appliedTravellers.children;
    return `${totalTravellers} Traveller${totalTravellers !== 1 ? "s" : ""}, ${
      cabinLabelMap[appliedTravellers.cabin]
    }`;
  }, [appliedTravellers, cabinLabelMap]);

  useEffect(() => {
    if (initialValues) {
      reset({
        segments: initialValues.segments,
        travellers: initialValues.travellers,
      });
      if (initialValues.travellers) {
        setAppliedTravellers(initialValues.travellers);
      }
    }
  }, [initialValues, reset]);

  // Handlers for better performance
  const handleTravellersClose = useCallback(() => {
    setTravellersOpen(false);
  }, []);

  const addSegment = useCallback(() => {
    if (fields.length >= 6) return;
    const lastSegment = segments[fields.length - 1];
    append({
      from: lastSegment?.to || { city: "", iataCode: "" },
      to: { city: "", iataCode: "" },
      depart: "",
    });
  }, [append, fields.length, segments]);

  const removeSegment = useCallback(
    (index) => {
      if (fields.length > 2) remove(index);
    },
    [fields.length, remove]
  );

  // Memoized submit handler
  const onSubmit = useCallback(
    (values) => {
      const travelClass =
        values.travellers.cabin === "premium_economy"
          ? "PREMIUM_ECONOMY"
          : values.travellers.cabin.toUpperCase();

      // Convert form data to API format for the search function
      const apiFormData = {
        originDestinations: values.segments.map((segment, index) => ({
          id: (index + 1).toString(),
          originLocationCode: segment.from.iataCode,
          destinationLocationCode: segment.to.iataCode,
          departureDateTimeRange: {
            date: formatDateForURL(segment.depart),
          },
          originCity: segment.from.city,
          destinationCity: segment.to.city,
        })),
        travelers: [
          ...Array(values.travellers.adults)
            .fill(null)
            .map((_, i) => ({
              id: (i + 1).toString(),
              travelerType: "ADULT",
            })),
          ...Array(values.travellers.children)
            .fill(null)
            .map((_, i) => ({
              id: (values.travellers.adults + i + 1).toString(),
              travelerType: "CHILD",
            })),
        ],
        sources: ["GDS"],
        searchCriteria: {
          maxFlightOffers: 25,
          flightFilters: {
            cabinRestrictions: [
              {
                cabin: travelClass,
                coverage: "MOST_SEGMENTS",
                originDestinationIds: values.segments.map((_, index) =>
                  (index + 1).toString()
                ),
              },
            ],
          },
        },
      };

      // Also store the original form data for session storage
      const sessionFormData = {
        ...values,
        // Serialize dates before storing in session to prevent race conditions
        segments: values.segments.map((segment) => ({
          ...segment,
          depart: segment.depart ? formatDateForURL(segment.depart) : "",
        })),
        type: "multicity",
        travelClass,
        regionalSettings: regionalSettings,
      };

      // Log search event (fire-and-forget) - use first segment for origin/destination
      if (values.segments.length > 0) {
        logSearchEvent({
          origin: values.segments[0].from.iataCode,
          destination: values.segments[values.segments.length - 1].to.iataCode,
          tripType: "multi-city",
          travelClass: values.travellers.cabin,
          adults: values.travellers.adults,
          children: values.travellers.children,
        });
      }

      if (onSearch) {
        onSearch(apiFormData);
      } else {
        setSessionData(sessionFormData);
        navigate("/search/flight");
      }
    },
    [navigate, onSearch, setSessionData, regionalSettings]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <fieldset className="tw:space-y-4 tw:lg:space-y-0">
        {fields.map((field, segmentIndex) => (
          <SegmentRow
            key={field.id}
            segmentIndex={segmentIndex}
            segments={segments}
            setValue={setValue}
            fields={fields}
            addSegment={addSegment}
            removeSegment={removeSegment}
            isSubmitting={isSubmitting}
          />
        ))}

        {fields.length < 6 && (
          <button
            type="button"
            aria-label="Add new segment"
            onClick={addSegment}
            className="tw:justify-self-center tw:lg:justify-self-end tw:md:!w-fit tw:px-5 tw:h-[62px] tw:shrink-0 tw:2xl:px-0 tw:lg:!w-full tw:lg:bg-primary tw:!text-gray-500 tw:font-medium tw:lg:!text-white tw:hover:bg-primary/80 tw:!rounded-lg tw:items-center tw:flex tw:justify-center tw:gap-2"
            disabled={isSubmitting}
          >
            <Plus size={24} />
            <span className="tw:lg:hidden">Add another flight</span>
          </button>
        )}

        {fields.length > 2 && (
          <button
            type="button"
            aria-label="Clear All"
            onClick={() => reset()}
            className="tw:lg:hidden tw:justify-self-center tw:lg:justify-self-end tw:md:!w-fit tw:px-5 tw:shrink-0 tw:2xl:px-0 tw:lg:bg-primary tw:!text-gray-500 tw:font-medium tw:lg:!text-white tw:hover:bg-primary/80 tw:!rounded-lg tw:items-center tw:flex tw:justify-center tw:gap-2"
            disabled={isSubmitting}
          >
            <Trash size={18} />
            <span>Clear all</span>
          </button>
        )}

        <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-center tw:lg:justify-between tw:gap-4 tw:w-full tw:mt-6 tw:lg:mt-4">
          {/* Travellers & Cabin Class */}
          <div className="tw:w-full tw:lg:w-[350px]">
            <Popover open={travellersOpen} onOpenChange={setTravellersOpen}>
              <PopoverTrigger>
                <div className="tw:relative">
                  <input
                    id="travellers-input"
                    name="travellers"
                    type="text"
                    className="tw:peer tw:py-[10px] tw:px-5 tw:h-[62px] tw:block tw:w-full tw:border tw:!border-muted tw:text-[15px] tw:!font-semibold tw:rounded-lg tw:placeholder:text-transparent tw:focus:border-primary tw:focus-visible:tw:border-primary tw:focus-visible:outline-hidden tw:focus:ring-primary tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:focus:pt-6 tw:focus:pb-2 tw:not-placeholder-shown:pt-6 tw:not-placeholder-shown:pb-2 tw:autofill:pt-6 tw:autofill:pb-2 tw:focus-visible:ring-0 tw:read-only:cursor-default tw:select-none"
                    placeholder="Travellers"
                    aria-labelledby="travellers-label"
                    value={travellersSummary}
                    readOnly
                  />
                  <label
                    id="travellers-label"
                    htmlFor="travellers-input"
                    className="tw:max-w-full tw:absolute tw:top-0 tw:start-0 tw:h-full tw:!p-[14px_20.5px] tw:text-[20px] tw:text-secondary tw:truncate tw:pointer-events-none tw:transition tw:ease-in-out tw:duration-100 tw:border tw:border-transparent tw:origin-[0_0] tw:peer-disabled:opacity-50 tw:peer-disabled:pointer-events-none tw:peer-not-placeholder-shown:scale-80 tw:peer-not-placeholder-shown:translate-x-0.5 tw:peer-not-placeholder-shown:-translate-y-1.5 tw:peer-not-placeholder-shown:text-secondary"
                  >
                    Travellers & Cabin Class
                  </label>
                </div>
              </PopoverTrigger>
              <PopoverContent mobileTitle="Select Cabin" className="tw:w-[300px]">
                {/* Cabin Selection */}
                <div className="tw:flex tw:flex-col tw:mb-3 tw:w-full">
                  <label htmlFor="cabin-select" className="tw:font-medium">
                    Cabin Class
                  </label>
                  <Select
                    value={travellers.cabin}
                    onValueChange={(value) =>
                      setValue("travellers.cabin", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Cabin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">
                        Premium Economy
                      </SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first_class">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Adult Travellers */}
                <div className="tw:flex tw:flex-col tw:mb-3">
                  <label className="tw:font-medium">Adults (Age 18+)</label>
                  <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:border tw:border-muted tw:!rounded-md tw:p-2">
                    <button
                      type="button"
                      aria-label="Decrease adult count"
                      onClick={() =>
                        setValue(
                          "travellers.adults",
                          Math.max(1, travellers.adults - 1)
                        )
                      }
                      className="tw:size-8 tw:flex tw:items-center tw:justify-center tw:bg-muted/50 tw:text-white tw:hover:bg-muted tw:transition tw:!rounded tw:duration-100"
                    >
                      <Minus />
                    </button>
                    <span
                      className="tw:text-lg"
                      aria-label={`${travellers.adults} adults`}
                    >
                      {travellers.adults}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase adult count"
                      onClick={() =>
                        setValue(
                          "travellers.adults",
                          Math.min(9, travellers.adults + 1)
                        )
                      }
                      className="tw:size-8 tw:flex tw:items-center tw:justify-center tw:bg-muted/50 tw:text-white tw:hover:bg-muted tw:transition tw:!rounded tw:duration-100"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>

                {/* Children Travellers */}
                <div className="tw:flex tw:flex-col tw:mb-3">
                  <label className="tw:font-medium">Children (Age 0-17)</label>
                  <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:border tw:border-muted tw:!rounded-md tw:p-2">
                    <button
                      type="button"
                      aria-label="Decrease children count"
                      onClick={() =>
                        setValue(
                          "travellers.children",
                          Math.max(0, travellers.children - 1)
                        )
                      }
                      className="tw:size-8 tw:flex tw:items-center tw:justify-center tw:bg-muted/50 tw:text-white tw:hover:bg-muted tw:transition tw:!rounded tw:duration-100"
                    >
                      <Minus />
                    </button>
                    <span
                      className="tw:text-lg"
                      aria-label={`${travellers.children} children`}
                    >
                      {travellers.children}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase children count"
                      onClick={() =>
                        setValue(
                          "travellers.children",
                          Math.min(9, travellers.children + 1)
                        )
                      }
                      className="tw:size-8 tw:flex tw:items-center tw:justify-center tw:bg-muted/50 tw:text-white tw:hover:bg-muted tw:transition tw:!rounded tw:duration-100"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>

                {/* Apply & Reset Button */}
                <div className="tw:flex tw:items-center tw:flex-wrap tw:lg:flex-nowrap tw:gap-2">
                  <button
                    type="button"
                    aria-label="Reset traveller settings"
                    onClick={() => {
                      if (initialValues?.travellers) {
                        setValue("travellers", { ...initialValues.travellers });
                        setAppliedTravellers({ ...initialValues.travellers });
                      } else {
                        setValue("travellers", {
                          cabin: "economy",
                          adults: 1,
                          children: 0,
                        });
                        setAppliedTravellers(null);
                      }
                      handleTravellersClose();
                    }}
                    className="tw:px-3 tw:py-2 tw:w-full tw:flex tw:items-center tw:justify-center tw:bg-muted/50 tw:hover:bg-muted tw:transition tw:!rounded tw:duration-100 tw:font-medium"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    aria-label="Apply traveller settings"
                    onClick={() => {
                      setAppliedTravellers({ ...travellers });
                      handleTravellersClose();
                    }}
                    className="tw:px-3 tw:py-2 tw:w-full tw:flex tw:items-center tw:justify-center tw:bg-primary tw:!text-white tw:hover:bg-primary/80 tw:transition tw:!rounded tw:duration-100 tw:font-medium"
                  >
                    Apply
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            aria-label="Search multi-city flights"
            className="tw:w-full tw:md:w-fit tw:lg:w-[300px] tw:px-5 tw:h-[62px] tw:shrink-0 tw:bg-primary tw:!text-white tw:hover:bg-primary/80 tw:!rounded-lg tw:items-center tw:flex tw:justify-center tw:gap-2"
            disabled={isSubmitting}
          >
            <IoSearchOutline size={28} />
            <span className="tw:text-xl tw:font-medium">Search</span>
          </button>
        </div>
      </fieldset>
    </form>
  );
};

MultiCityForm.propTypes = {
  initialValues: PropTypes.shape({
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        from: PropTypes.shape({
          city: PropTypes.string,
          iataCode: PropTypes.string,
        }),
        to: PropTypes.shape({
          city: PropTypes.string,
          iataCode: PropTypes.string,
        }),
        depart: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),
      })
    ),
    travellers: PropTypes.shape({
      cabin: PropTypes.string,
      adults: PropTypes.number,
      children: PropTypes.number,
    }),
  }),
  onSearch: PropTypes.func,
};

export default MultiCityForm;
