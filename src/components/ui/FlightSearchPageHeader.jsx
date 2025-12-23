import PropTypes from "prop-types";

// Helper function to format cabin class names nicely
const formatCabinClass = (cabin) => {
  if (!cabin) return "";
  return cabin
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const FlightSearchPageHeader = ({ initialOneWayFormValues }) => {
  const { flyingFrom, flyingTo, travellers } = initialOneWayFormValues;
  const totalTravellers = (travellers.adults || 0) + (travellers.children || 0);

  return (
    <h1 className="tw:text-base! tw:lg:!text-[18px] tw:font-semibold tw:text-[#00000B] tw:!mb-5">
      {`${flyingFrom.city} (${flyingFrom.iataCode}) - ${flyingTo.city} (${
        flyingTo.iataCode
      }) - ${totalTravellers} Traveller${
        totalTravellers !== 1 ? "s" : ""
      }, ${formatCabinClass(travellers.cabin)}`}
    </h1>
  );
};

FlightSearchPageHeader.propTypes = {
  initialOneWayFormValues: PropTypes.shape({
    flyingFrom: PropTypes.shape({
      city: PropTypes.string,
      iataCode: PropTypes.string,
    }).isRequired,
    flyingTo: PropTypes.shape({
      city: PropTypes.string,
      iataCode: PropTypes.string,
    }).isRequired,
    travellers: PropTypes.shape({
      adults: PropTypes.number,
      children: PropTypes.number,
      cabin: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default FlightSearchPageHeader;
