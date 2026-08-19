/** Panel used to group one repeatable item (a section, tip, allowance, airline). */
export const subCardSx = {
  p: 2,
  bgcolor: "rgba(255,255,255,0.02)",
  borderRadius: 1,
  border: "1px solid rgba(255,255,255,0.05)",
};

export const dividerSx = { borderColor: "rgba(255, 255, 255, 0.08)" };

/** Shape of one airport record inside the airport_info CMS blob. */
export const emptyAirport = {
  name: "",
  iataCode: "",
  city: "",
  country: "",
  flag: "",
  introduction: "",
  sections: [],
  tips: [],
  baggage: { summary: "", allowances: [], pdfUrl: "", pdfKey: "" },
  terminals: [],
  airlines: [],
};
