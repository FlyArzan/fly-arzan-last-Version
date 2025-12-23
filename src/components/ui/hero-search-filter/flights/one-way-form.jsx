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
import { useEffect, useState, useMemo, useCallback } from "react";
import { GiCommercialAirplane } from "react-icons/gi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { OneWayFormSchema } from "@/schema/one-way-schema";
import { useCityLocation } from "@/hooks/useCityLocation";
import { useDebounceValue, useSessionStorage } from "usehooks-ts";
import { formatDateForURL } from "@/lib/flight-utils";
import { useRegionalSettings } from "../../../../context/RegionalSettingsContext";
import Calendar from "../../calendar";
import PropTypes from "prop-types";
import { logSearchEvent } from "@/lib/analytics";
import { getNearestAirportCached } from "@/utils/locationUtils";

const OneWayForm = ({ initialValues }) => {
  const navigate = useNavigate();
  const { regionalSettings } = useRegionalSettings();
  const [queryFrom, setQueryFrom] = useDebounceValue("", 600);
  const [queryTo, setQueryTo] = useDebounceValue("", 600);
  const [travellersOpen, setTravellersOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [appliedTravellers, setAppliedTravellers] = useState(
    initialValues?.travellers ? { ...initialValues.travellers } : null
  );
  const [isSwapped, setIsSwapped] = useState(false);
  const [tempDepart, setTempDepart] = useState(
    initialValues?.depart || undefined
  );

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(OneWayFormSchema),
    defaultValues: {
      flyingFrom: initialValues?.flyingFrom || {
        city: "",
        iataCode: "",
      },
      flyingTo: initialValues?.flyingTo || {
        city: "",
        iataCode: "",
      },
      travellers: {
        cabin: initialValues?.travellers?.cabin || "economy",
        adults: initialValues?.travellers?.adults ?? 1,
        children: initialValues?.travellers?.children ?? 0,
      },
      depart: initialValues?.depart || "",
    },
  });

  // Handlers for better performance (defined after useForm)
  const handleSwap = useCallback(() => {
    // Get current values directly from form state
    const currentValues = watch();
    setValue("flyingFrom", currentValues.flyingTo);
    setValue("flyingTo", currentValues.flyingFrom);
    setIsSwapped((prevValue) => !prevValue);
  }, [setValue, watch]);

  const handleTravellersClose = useCallback(() => {
    setTravellersOpen(false);
  }, []);

  const handleDateClose = useCallback(() => {
    setDateOpen(false);
  }, []);

  useEffect(() => {
    if (initialValues) {
      reset({
        flyingFrom: initialValues.flyingFrom,
        flyingTo: initialValues.flyingTo,
        travellers: initialValues.travellers,
        depart: initialValues.depart || "",
      });
      setTempDepart(initialValues.depart || undefined);
    }
  }, [initialValues, reset]);

  // Auto-detect nearest airport and set as departure if not already set
  useEffect(() => {
    const autoSetDeparture = async () => {
      // Only auto-set if flyingFrom is empty
      if (!flyingFrom?.iataCode) {
        try {
          const nearestAirport = await getNearestAirportCached();
          if (nearestAirport?.iataCode && nearestAirport?.city) {
            setValue("flyingFrom", {
              city: nearestAirport.city,
              iataCode: nearestAirport.iataCode,
            });
          }
        } catch (error) {
          console.warn("Could not auto-detect departure airport:", error);
        }
      }
    };

    autoSetDeparture();
  }, []); // Run once on mount

  // Watch form values
  const formValues = watch();
  const { flyingFrom, flyingTo, travellers, depart } = formValues;

  // Use session storage to persist form data
  const [, setSessionData] = useSessionStorage("selected-flight", {});

  // Get City Data
  const { data: cityFromData, isLoading: isLoadingFrom } =
    useCityLocation(queryFrom);
  const cityFromOptions = cityFromData?.data || [];

  const { data: cityToData, isLoading: isLoadingTo } = useCityLocation(queryTo);
  const cityToOptions = cityToData?.data || [];

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

  // Memoized submit handler
  const onSubmit = useCallback(
    (values) => {
      const travelClass =
        values.travellers.cabin === "premium_economy"
          ? "PREMIUM_ECONOMY"
          : values.travellers.cabin.toUpperCase();

      // Store the form data for session storage
      const sessionFormData = {
        flyingFrom: values.flyingFrom,
        flyingTo: values.flyingTo,
        travellers: values.travellers,
        depart: values.depart ? formatDateForURL(values.depart) : "",
        type: "one-way",
        travelClass,
        regionalSettings: regionalSettings,
      };

      setSessionData(sessionFormData);

      // Log search event (fire-and-forget)
      logSearchEvent({
        origin: values.flyingFrom.iataCode,
        destination: values.flyingTo.iataCode,
        tripType: "one-way",
        travelClass: values.travellers.cabin,
        adults: values.travellers.adults,
        children: values.travellers.children,
      });

      navigate("/search/flight");
    },
    [navigate, setSessionData, regionalSettings]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <fieldset className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:xl:grid-cols-4 tw:2xl:flex tw:items-center tw:gap-4">
        <div className="tw:flex tw:flex-col tw:sm:flex-row tw:gap-4 tw:relative tw:grow tw:sm:col-span-2">
          {/* Flying From */}
          <Combobox
            value={flyingFrom}
            onChange={(value) => setValue("flyingFrom", value)}
            onClose={() => setQueryFrom("")}
          >
            <div
              className={cn(
                "tw:relative tw:z-40 tw:grow",
                isSwapped ? "tw:order-2" : "tw:order-1"
              )}
            >
              <ComboboxInput
                id="flyingFrom"
                displayValue={(data) => data?.city}
                onChange={(event) => setQueryFrom(event.target.value)}
                className="tw:peer tw:py-[10px] tw:px-5 tw:h-[62px] tw:block tw:w-full tw:border tw:!border-muted tw:text-[15px] tw:!font-semibold tw:rounded-lg tw:placeholder:text-transparent tw:focus:border-primary tw:focus-visible:tw:border-primary tw:focus-visible:outline-hidden tw:focus:ring-primary tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:focus:pt-6 tw:focus:pb-2 tw:not-placeholder-shown:pt-6 tw:not-placeholder-shown:pb-2 tw:autofill:pt-6 tw:autofill:pb-2 tw:focus-visible:ring-0"
                placeholder="From"
              />
              <label
                htmlFor="flyingFrom"
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
                    value={{
                      city: data.city,
                      iataCode: data.iataCode,
                    }}
                    className="tw:flex"
                  >
                    <div className="tw:flex tw:justify-start tw:gap-2.5 tw:w-full">
                      <GiCommercialAirplane
                        size={20}
                        className="tw:text-secondary tw:!shrink-0 tw:mt-1"
                      />
                      <div className="tw:flex tw:flex-col">
                        <div>
                          {data.city} ({data.iataCode})
                        </div>
                        <div className="tw:text-secondary tw:text-sm">
                          {data.airport} ({data.country})
                        </div>
                      </div>
                    </div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>
          <button
            type="button"
            onClick={handleSwap}
            className={cn(
              "tw:absolute tw:z-[45] tw:top-[45px] tw:sm:top-[50%] tw:left-1/2 tw:-translate-x-1/2 tw:bg-white tw:sm:-translate-y-1/2 tw:h-[50px] tw:w-[50px] tw:inline-flex tw:items-center tw:justify-center tw:transition-[rotate] tw:duration-300 tw:border tw:!border-muted tw:!rounded-full",
              isSwapped ? "tw:rotate-180" : "tw:-rotate-180"
            )}
          >
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.46039 7.34263C3.69297 7.57559 4.07227 7.57559 4.30485 7.34263L5.07727 6.57021C5.31023 6.33763 5.31023 5.95833 5.07727 5.72574L4.30485 4.95333H14.9332C15.9214 4.95333 16.7251 5.7571 16.7251 6.74531C16.7251 7.23922 17.1272 7.64129 17.6211 7.64129H18.2184C18.7124 7.64129 19.1144 7.23922 19.1144 6.74531C19.1144 4.43963 17.2388 2.56402 14.9332 2.56402H4.30485L5.07727 1.79161C5.31023 1.55902 5.31023 1.17972 5.07727 0.947135L4.30485 0.174718C4.07227 -0.0582393 3.69297 -0.0582393 3.46039 0.174718L0.0873589 3.54737C-0.0291196 3.66422 -0.0291196 3.85313 0.0873589 3.96998L3.46039 7.34263Z"
                fill="#353978"
              />
              <path
                d="M15.6541 10.3299C15.4215 10.097 15.0425 10.097 14.8096 10.3299L14.0372 11.1023C13.8038 11.3357 13.8034 11.713 14.0372 11.9468L14.8096 12.7192H4.18128C3.19308 12.7192 2.3893 11.9154 2.3893 10.9272C2.3893 10.4333 1.98723 10.0312 1.49332 10.0312H0.895989C0.402075 10.0312 0 10.4333 0 10.9272C0 13.2329 1.8756 15.1085 4.18128 15.1085H14.8096L14.0372 15.8809C13.8038 16.1143 13.8034 16.4916 14.0372 16.7254L14.8096 17.4978C15.0426 17.7308 15.4211 17.7308 15.6541 17.4978L19.0271 14.1252C19.1436 14.0083 19.1436 13.8194 19.0271 13.7026L15.6541 10.3299Z"
                fill="#353978"
              />
            </svg>
          </button>
          {/* Flying To */}
          <Combobox
            value={flyingTo}
            onChange={(value) => setValue("flyingTo", value)}
            onClose={() => setQueryFrom("")}
          >
            <div
              className={cn(
                "tw:relative tw:grow",
                isSwapped ? "tw:order-1" : "tw:order-2"
              )}
            >
              <ComboboxInput
                id="flyingTo"
                displayValue={(data) => data?.city}
                onChange={(event) => setQueryTo(event.target.value)}
                className="tw:peer tw:py-[10px] tw:px-5 tw:h-[62px] tw:block tw:w-full tw:border tw:!border-muted tw:text-[15px] tw:!font-semibold tw:rounded-lg tw:placeholder:text-transparent tw:focus:border-primary tw:focus-visible:tw:border-primary tw:focus-visible:outline-hidden tw:focus:ring-primary tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:focus:pt-6 tw:focus:pb-2 tw:not-placeholder-shown:pt-6 tw:not-placeholder-shown:pb-2 tw:autofill:pt-6 tw:autofill:pb-2 tw:focus-visible:ring-0"
                placeholder="To"
              />
              <label
                htmlFor="flyingTo"
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

                {cityToOptions.map((data, index) => {
                  return (
                    <ComboboxOption
                      key={index}
                      value={{
                        city: data.city,
                        iataCode: data.iataCode,
                      }}
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
                  );
                })}
              </ComboboxOptions>
            </div>
          </Combobox>
        </div>
        {/* Depart */}
        <Popover open={dateOpen} onOpenChange={setDateOpen} className="tw:grow">
          <PopoverTrigger>
            <input
              type="text"
              id="depart"
              className="tw:peer tw:py-[10px] tw:px-5 tw:h-[62px] tw:block tw:w-full tw:border tw:!border-muted tw:text-[15px] tw:!font-semibold tw:rounded-lg tw:placeholder:text-transparent tw:focus:border-primary tw:focus-visible:tw:border-primary tw:focus-visible:outline-hidden tw:focus:ring-primary tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:focus:pt-6 tw:focus:pb-2 tw:not-placeholder-shown:pt-6 tw:not-placeholder-shown:pb-2 tw:autofill:pt-6 tw:autofill:pb-2 tw:focus-visible:ring-0 tw:read-only:cursor-default tw:select-none"
              placeholder="Depart"
              value={depart instanceof Date ? depart.toLocaleDateString() : ""}
              readOnly
            />
            <label
              htmlFor="depart"
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
                    setTempDepart(initialValues?.depart || undefined);
                  }}
                  className="tw:w-full md:tw:w-auto tw:px-6 tw:py-2 tw:flex tw:items-center tw:justify-center tw:bg-muted/50 tw:hover:bg-muted tw:transition tw:!rounded tw:duration-100 tw:font-medium"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue("depart", tempDepart);
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
            />
          </PopoverContent>
        </Popover>
        {/* Travellers & Cabin Class */}
        <Popover
          open={travellersOpen}
          onOpenChange={setTravellersOpen}
          className="tw:grow"
        >
          <PopoverTrigger>
            <input
              type="text"
              id="travellers"
              className="tw:peer tw:py-[10px] tw:px-5 tw:h-[62px] tw:block tw:w-full tw:border tw:!border-muted tw:text-[15px] tw:!font-semibold tw:rounded-lg tw:placeholder:text-transparent tw:focus:border-primary tw:focus-visible:tw:border-primary tw:focus-visible:outline-hidden tw:focus:ring-primary tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:focus:pt-6 tw:focus:pb-2 tw:not-placeholder-shown:pt-6 tw:not-placeholder-shown:pb-2 tw:autofill:pt-6 tw:autofill:pb-2 tw:focus-visible:ring-0 tw:read-only:cursor-default tw:select-none"
              placeholder="Travellers"
              value={travellersSummary}
              readOnly
            />
            <label
              htmlFor="travellers"
              className="tw:max-w-full tw:absolute tw:top-0 tw:start-0 tw:h-full tw:!p-[14px_20.5px] tw:text-[20px] tw:text-secondary tw:truncate tw:pointer-events-none tw:transition tw:ease-in-out tw:duration-100 tw:border tw:border-transparent tw:origin-[0_0] tw:peer-disabled:opacity-50 tw:peer-disabled:pointer-events-none tw:peer-not-placeholder-shown:scale-80 tw:peer-not-placeholder-shown:translate-x-0.5 tw:peer-not-placeholder-shown:-translate-y-1.5 tw:peer-not-placeholder-shown:text-secondary"
            >
              Travellers & Cabin Class
            </label>
          </PopoverTrigger>
          <PopoverContent mobileTitle="Select Cabin" className="tw:w-[300px]">
            {/* Cabin Selection */}
            <div className="tw:flex tw:flex-col tw:mb-3 tw:w-full">
              <label htmlFor="cabin" className="tw:font-medium">
                Cabin Class
              </label>
              <Select
                value={travellers.cabin}
                onValueChange={(value) => setValue("travellers.cabin", value)}
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
              <label htmlFor="adults" className="tw:font-medium">
                Adults (Age 18+)
              </label>
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:border tw:border-muted tw:!rounded-md tw:p-2">
                <button
                  type="button"
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
                <span className="tw:text-lg">{travellers.adults}</span>
                <button
                  type="button"
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
              <label htmlFor="children" className="tw:font-medium">
                Children (Age 0-17)
              </label>
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:border tw:border-muted tw:!rounded-md tw:p-2">
                <button
                  type="button"
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
                <span className="tw:text-lg">{travellers.children}</span>
                <button
                  type="button"
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
        {/* Search Button */}
        <button
          className="tw:w-full tw:xl:col-span-4 tw:sm:col-span-2 tw:justify-self-end tw:md:!w-fit tw:px-5 tw:h-[62px] tw:shrink-0 tw:2xl:px-0 tw:2xl:!w-[62px] tw:bg-primary tw:!text-white tw:hover:bg-primary/80 tw:!rounded-lg tw:items-center tw:flex tw:justify-center tw:gap-2"
          disabled={isSubmitting}
        >
          <IoSearchOutline size={28} />
          <span className="tw:2xl:hidden tw:text-xl tw:font-medium">
            Search
          </span>
        </button>
      </fieldset>
    </form>
  );
};

OneWayForm.propTypes = {
  initialValues: PropTypes.shape({
    flyingFrom: PropTypes.shape({
      city: PropTypes.string,
      iataCode: PropTypes.string,
    }),
    flyingTo: PropTypes.shape({
      city: PropTypes.string,
      iataCode: PropTypes.string,
    }),
    travellers: PropTypes.shape({
      cabin: PropTypes.string,
      adults: PropTypes.number,
      children: PropTypes.number,
    }),
    depart: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }),
};

export default OneWayForm;
