import React, { useEffect } from "react";

import HotelBookings from "../../../assets/Images/HotelBookings.png";
import FlightReservations from "../../../assets/Images/FlightReservations.png";
import TotalBooking from "../../../assets/Images/TotalBooking.png";
import CarRental from "../../../assets/Images/CarRental.png";
import BookingCalendar from "../../Dashboard_page_compontes/BookingCalendar";
import dp from "../../../assets/Images/dp.png";
import dpimg from "../../../assets/Images/dpimg.png";
import StyledChart from "../../Dashboard_page_compontes/ReservationChart";
import TableComponent from "../../Dashboard_page_compontes/TableComponent ";
import Tab12 from "../../Tab-componet/Tab12";

const Dashboard1 = () => {


  return (
    <>
      <section className="Dashboard">
        <div className="main-Dashboard">
          <div className="Dashboard-top-box">

            <div className="Dashboard-top-card">
              <div className="Dashboard-top-card-icon">
                <img src={TotalBooking} alt="Total bookings" />
              </div>
              <div className="Dashboard-top-card-tital">
                <h2>8,565</h2>
                <p>Total Booking</p>
              </div>
            </div>
            <div className="Dashboard-top-card">
              <div className="Dashboard-top-card-icon">
                <img src={HotelBookings} alt="Hotel bookings" />
              </div>
              <div className="Dashboard-top-card-tital">
                <h2>8,565</h2>
                <p>Hotel Bookings</p>
              </div>
            </div>
            <div className="Dashboard-top-card">
              <div className="Dashboard-top-card-icon">
                <img src={FlightReservations} alt="Flight reservations" />
              </div>
              <div className="Dashboard-top-card-tital">
                <h2>8,565</h2>
                <p>Flight Reservations</p>
              </div>
            </div>
            <div className="Dashboard-top-card">
              <div className="Dashboard-top-card-icon">
                <img src={CarRental} alt="Car rentals" />
              </div>
              <div className="Dashboard-top-card-tital">
                <h2>8,565</h2>
                <p>Car Rental</p>
              </div>
            </div>
          </div>

          <Tab12 />

        </div>
      </section>
    </>
  );
};

export default Dashboard1;
