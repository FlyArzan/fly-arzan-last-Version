import { createBrowserRouter } from "react-router-dom";
import Login from "../components/login/Login";
import Singup from "../components/login/Singup";
import LandingFlights from "../pages/LandingFlights";
import LandingHotels from "../pages/LandingHotels";
import LandingCar from "../pages/LandingCar";
import CarInner from "../pages/CarInner";
import HotelsInner from "../pages/HotelsInner";
import FlightsInner from "../pages/FlightsInner";
import FaqInner from "../pages/FaqInner";
import ReviewInner from "../pages/ReviewInner";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Booking_StepFormmain from "../components/Flights_Bookings_Page_components/Booking_StepFormmain";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import FlightsInner2 from "../pages/FlightsInner2";
import BookYourTicket from "../pages/BookYourTicket";
import WeDirecting from "../pages/WeDirecting";
import Recentactivities from "../components/login/Recentactivities";
import FilterFlights from "../components/Filter_Flights_componets/FilterFlights";
import COVID from "../header-footer/COVID";
import VisaRequirements from "../header-footer/VisaRequirements";
import Airport from "../header-footer/Airport";
import FlightSearchPage from "../pages/search/flight-search-page";
import FlightDetailsPage from "@/pages/details/flight-details-page";
import {
  AdminLayout,
  Dashboard as AdminDashboard,
  Users,
  UserDetails,
  Settings,
  Feedback,
  AnalyticsLogs,
} from "../pages/admin";
import AdminAuthGuard from "../components/auth/AdminAuthGuard";
// Admin CMS Pages
import AdminCmsAbout from "../pages/admin/cms/about-us";
import AdminCmsFaq from "../pages/admin/cms/faq";
import AdminCmsPrivacy from "../pages/admin/cms/privacy-policy";
import AdminCmsTerms from "../pages/admin/cms/terms-conditions";
import AdminCmsContact from "../pages/admin/cms/contact";
import AdminCmsVisa from "../pages/admin/cms/visa-requirements";
import AdminCmsCovid from "../pages/admin/cms/covid-19";
import AdminCmsAirport from "../pages/admin/cms/airport";
import Roles from "../pages/admin/roles";
import Customers from "../pages/admin/customers";
import CustomerDetails from "../pages/admin/customer-details";
import EmailCampaigns from "../pages/admin/email-campaigns";
import AdminProfile from "../pages/admin/profile";
import AdminNotifications from "../pages/admin/notifications";

// Analytics Pages
import EngagementMetrics from "../pages/admin/analytics/engagement";
import SearchRoutes from "../pages/admin/analytics/routes";
import TrendCharts from "../pages/admin/analytics/trends";

// Monitoring Pages
import APIHealth from "../pages/admin/monitoring/health";
import SystemAlerts from "../pages/admin/monitoring/alerts";
import SystemLogs from "../pages/admin/monitoring/logs";

// Auth Pages
import Sessions from "../pages/admin/auth/sessions";

// User Pages
import UserDashboard from "../pages/user/UserDashboard";
import NotificationsPage from "../pages/user/NotificationsPage";
import UserAuthGuard from "../components/auth/UserAuthGuard";

// Auth Pages
import ResetPassword from "../pages/ResetPassword";
import AdminLogin from "../pages/AdminLogin";

// Root Layout and Loader for prefetching geo data
import RootLayout from "../layouts/RootLayout";
import { rootLoader } from "../loaders/rootLoader";

// Create router with data loaders for prefetching
// Future flags to silence React Router v7 deprecation warnings
export const router = createBrowserRouter(
  [
    {
      // Root layout with loader - prefetches geo data before any route renders
      element: <RootLayout />,
      loader: rootLoader,
      children: [
        { path: "/", element: <LandingFlights /> },

        // User Dashboard (for authenticated non-admin users)
        {
          path: "/dashboard",
          element: (
            <UserAuthGuard>
              <UserDashboard />
            </UserAuthGuard>
          ),
        },

        // User Notifications page
        {
          path: "/dashboard/notifications",
          element: (
            <UserAuthGuard>
              <NotificationsPage />
            </UserAuthGuard>
          ),
        },

        {
          path: "/admin",
          element: (
            <AdminAuthGuard>
              <AdminLayout />
            </AdminAuthGuard>
          ),
          children: [
            { index: true, element: <AdminDashboard /> },
            { path: "dashboard", element: <AdminDashboard /> },

            // Analytics Routes
            { path: "logs", element: <AnalyticsLogs /> },
            { path: "analytics/engagement", element: <EngagementMetrics /> },
            { path: "analytics/routes", element: <SearchRoutes /> },
            { path: "analytics/trends", element: <TrendCharts /> },
            // CMS routes
            { path: "cms/about-us", element: <AdminCmsAbout /> },
            { path: "cms/faq", element: <AdminCmsFaq /> },
            { path: "cms/privacy-policy", element: <AdminCmsPrivacy /> },
            { path: "cms/terms-conditions", element: <AdminCmsTerms /> },
            { path: "cms/contact", element: <AdminCmsContact /> },
            { path: "cms/visa-requirements", element: <AdminCmsVisa /> },
            { path: "cms/covid-19", element: <AdminCmsCovid /> },
            { path: "cms/airport", element: <AdminCmsAirport /> },

            // Monitoring Routes
            { path: "monitoring/health", element: <APIHealth /> },
            { path: "monitoring/alerts", element: <SystemAlerts /> },
            { path: "monitoring/logs", element: <SystemLogs /> },

            // Auth Routes
            { path: "auth/sessions", element: <Sessions /> },

            // User Management
            { path: "users", element: <Users /> },
            { path: "users/:id", element: <UserDetails /> },
            { path: "roles", element: <Roles /> },

            // Customer Management
            { path: "customers", element: <Customers /> },
            { path: "customers/:id", element: <CustomerDetails /> },

            // Email Campaigns
            { path: "email-campaigns", element: <EmailCampaigns /> },

            // Settings & Profile
            { path: "settings", element: <Settings /> },
            { path: "profile", element: <AdminProfile /> },
            { path: "notifications", element: <AdminNotifications /> },
            { path: "feedback", element: <Feedback /> },
          ],
        },

        { path: "/search/flight", element: <FlightSearchPage /> },

        { path: "/flight/details", element: <FlightDetailsPage /> },

        { path: "/Hotels", element: <LandingHotels /> },

        { path: "/Car", element: <LandingCar /> },

        { path: "/FlightsInner", element: <FlightsInner /> },

        { path: "/FlightsInner2", element: <FlightsInner2 /> },

        { path: "/Recentactivities", element: <Recentactivities /> },

        { path: "/HotelsInner", element: <HotelsInner /> },

        { path: "/CarInner", element: <CarInner /> },

        { path: "/Faq", element: <FaqInner /> },

        { path: "/BookYourTicket", element: <BookYourTicket /> },

        { path: "/ReviewInner", element: <ReviewInner /> },

        { path: "/About", element: <About /> },

        { path: "/Contact", element: <Contact /> },

        { path: "/PrivacyPolicy", element: <PrivacyPolicy /> },

        { path: "/TermsAndConditions", element: <TermsAndConditions /> },

        { path: "/Login", element: <Login /> },

        { path: "/Singup", element: <Singup /> },

        { path: "/reset-password", element: <ResetPassword /> },

        { path: "/admin-login", element: <AdminLogin /> },

        { path: "/loader", element: <WeDirecting /> },

        { path: "/FlightsBooking", element: <Booking_StepFormmain /> },
        { path: "/flight-search", element: <FilterFlights /> },

        { path: "/COVID", element: <COVID /> },

        { path: "/Airport", element: <Airport /> },

        { path: "/VisaRequirements", element: <VisaRequirements /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
