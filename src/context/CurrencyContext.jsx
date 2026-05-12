import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create Context
const CurrencyContext = createContext();

// Provider Component
export const CurrencyProvider = ({ children }) => {
  const [rates, setRates] = useState({}); // Rates for different currencies

  const selectedLocalCurr = JSON.parse(localStorage.getItem("selectCurr"));
  const [currency, setCurrency] = useState(selectedLocalCurr?.curr || ""); // Default USD
  const BASE_URL = `${import.meta.env.VITE_API_URL}/api/geo-currency`;

  // Fetch rates from backend (which proxies Open Exchange Rates server-side)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(BASE_URL);
        const data = response.data?.exchangeRate?.rates;
        if (data) setRates(data);
      } catch (error) {
        console.error("Failed to fetch currency rates:", error.message);
      }
    };

    fetchRates();
  }, []);

  // Convert Function
  const convertPrice = (amount, targetCurrency = currency) => {
    if (!rates[targetCurrency]) {
      return amount;
    }

    const rate = rates[targetCurrency];
    const converted = amount * rate;

    return converted.toFixed(2);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        convertPrice,
        selectedLocalCurr,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom Hook for easier use
export const useCurrency = () => useContext(CurrencyContext);
