/** Shared editor styles + airline record skeleton. */
export { dividerSx, subCardSx } from "../airport/shared";

/** Shape of one airline record inside the "airlines" CMS blob. */
export const emptyAirline = {
  name: "",
  iata: "",
  icao: "",
  country: "",
  countryCode: "",
  flag: "",
  website: "",
  introduction: "",
  sections: [],
  tips: [],
  baggage: { summary: "", allowances: [], pdfUrl: "", pdfKey: "" },
};
