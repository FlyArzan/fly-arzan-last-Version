/* @refresh reset */
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminAuthGuard from "../components/auth/AdminAuthGuard";
import UserAuthGuard from "../components/auth/UserAuthGuard";
import RootLayout from "../layouts/RootLayout";
import { rootLoader } from "../loaders/rootLoader";
import NotFound from "../pages/NotFound";

// Public pages
const LandingFlights = lazy(() => import("../pages/LandingFlights"));
const LandingHotels = lazy(() => import("../pages/LandingHotels"));
const LandingCar = lazy(() => import("../pages/LandingCar"));
const FlightSearchPage = lazy(() => import("../pages/search/flight-search-page"));
const FlightDetailsPage = lazy(() => import("../pages/details/flight-details-page"));
const HotelsInner = lazy(() => import("../pages/HotelsInner"));
const CarInner = lazy(() => import("../pages/CarInner"));
const FaqInner = lazy(() => import("../pages/FaqInner"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../pages/TermsAndConditions"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const AuthCallback = lazy(() => import("../pages/AuthCallback"));
const Login = lazy(() => import("../components/login/Login"));
const Singup = lazy(() => import("../components/login/Singup"));
const COVID = lazy(() => import("../header-footer/COVID"));
const VisaRequirements = lazy(() => import("../header-footer/VisaRequirements"));
const Airport = lazy(() => import("../header-footer/Airport"));

// User dashboard pages
const UserDashboard = lazy(() => import("../pages/user/UserDashboard"));
const NotificationsPage = lazy(() => import("../pages/user/NotificationsPage"));

// Admin pages
const AdminLayout = lazy(() => import("../layouts/admin-layout"));
const AdminDashboard = lazy(() => import("../pages/admin/dashboard"));
const Users = lazy(() => import("../pages/admin/users"));
const UserDetails = lazy(() => import("../pages/admin/user-details"));
const Settings = lazy(() => import("../pages/admin/settings"));
const Feedback = lazy(() => import("../pages/admin/feedback"));
const AnalyticsLogs = lazy(() => import("../pages/admin/analytics-logs"));
const Roles = lazy(() => import("../pages/admin/roles"));
const Customers = lazy(() => import("../pages/admin/customers"));
const CustomerDetails = lazy(() => import("../pages/admin/customer-details"));
const EmailCampaigns = lazy(() => import("../pages/admin/email-campaigns"));
const AdminProfile = lazy(() => import("../pages/admin/profile"));
const AdminNotifications = lazy(() => import("../pages/admin/notifications"));

// Admin Content pages
const AdminArticles = lazy(() => import("../pages/admin/content/articles"));
const AdminArticleForm = lazy(() => import("../pages/admin/content/article-form"));
const AdminVisaList = lazy(() => import("../pages/admin/visa-db/index"));
const AdminVisaForm = lazy(() => import("../pages/admin/visa-db/visa-form"));

// Public travel & visa pages
const TravelGuidesHub = lazy(() => import("../pages/TravelGuidesHub"));
const TravelGuidesCategory = lazy(() => import("../pages/TravelGuidesCategory"));
const ArticlePage = lazy(() => import("../pages/ArticlePage"));
const VisaInformationHub = lazy(() => import("../pages/VisaInformationHub"));
const VisaCountryPage = lazy(() => import("../pages/VisaCountryPage"));

// Admin CMS pages
const AdminCmsAbout = lazy(() => import("../pages/admin/cms/about-us"));
const AdminCmsFaq = lazy(() => import("../pages/admin/cms/faq"));
const AdminCmsPrivacy = lazy(() => import("../pages/admin/cms/privacy-policy"));
const AdminCmsTerms = lazy(() => import("../pages/admin/cms/terms-conditions"));
const AdminCmsContact = lazy(() => import("../pages/admin/cms/contact"));
const AdminCmsCovid = lazy(() => import("../pages/admin/cms/covid-19"));
const AdminCmsAirport = lazy(() => import("../pages/admin/cms/airport"));

// Admin analytics pages
const EngagementMetrics = lazy(() => import("../pages/admin/analytics/engagement"));
const SearchRoutes = lazy(() => import("../pages/admin/analytics/routes"));
const TrendCharts = lazy(() => import("../pages/admin/analytics/trends"));

// Admin monitoring pages
const APIHealth = lazy(() => import("../pages/admin/monitoring/health"));
const SystemAlerts = lazy(() => import("../pages/admin/monitoring/alerts"));
const SystemLogs = lazy(() => import("../pages/admin/monitoring/logs"));

// Admin auth pages
const Sessions = lazy(() => import("../pages/admin/auth/sessions"));

// When changing route paths, update spa-route-allowlist.mjs so the server keeps correct 404s.
export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      loader: rootLoader,
      children: [
        { path: "/", element: <LandingFlights /> },

        // User Dashboard
        {
          path: "/dashboard",
          element: (
            <UserAuthGuard>
              <UserDashboard />
            </UserAuthGuard>
          ),
        },
        {
          path: "/dashboard/notifications",
          element: (
            <UserAuthGuard>
              <NotificationsPage />
            </UserAuthGuard>
          ),
        },

        // Admin
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
            { path: "logs", element: <AnalyticsLogs /> },
            { path: "analytics/engagement", element: <EngagementMetrics /> },
            { path: "analytics/routes", element: <SearchRoutes /> },
            { path: "analytics/trends", element: <TrendCharts /> },
            { path: "cms/about-us", element: <AdminCmsAbout /> },
            { path: "cms/faq", element: <AdminCmsFaq /> },
            { path: "cms/privacy-policy", element: <AdminCmsPrivacy /> },
            { path: "cms/terms-conditions", element: <AdminCmsTerms /> },
            { path: "cms/contact", element: <AdminCmsContact /> },
            { path: "content/articles", element: <AdminArticles /> },
            { path: "content/articles/new", element: <AdminArticleForm /> },
            { path: "content/articles/:id", element: <AdminArticleForm /> },
            { path: "visa-db", element: <AdminVisaList /> },
            { path: "visa-db/new", element: <AdminVisaForm /> },
            { path: "visa-db/:id", element: <AdminVisaForm /> },
            { path: "cms/covid-19", element: <AdminCmsCovid /> },
            { path: "cms/airport", element: <AdminCmsAirport /> },
            { path: "monitoring/health", element: <APIHealth /> },
            { path: "monitoring/alerts", element: <SystemAlerts /> },
            { path: "monitoring/logs", element: <SystemLogs /> },
            { path: "auth/sessions", element: <Sessions /> },
            { path: "users", element: <Users /> },
            { path: "users/:id", element: <UserDetails /> },
            { path: "roles", element: <Roles /> },
            { path: "customers", element: <Customers /> },
            { path: "customers/:id", element: <CustomerDetails /> },
            { path: "email-campaigns", element: <EmailCampaigns /> },
            { path: "settings", element: <Settings /> },
            { path: "profile", element: <AdminProfile /> },
            { path: "notifications", element: <AdminNotifications /> },
            { path: "feedback", element: <Feedback /> },
          ],
        },

        // Flights
        { path: "/search/flight", element: <FlightSearchPage /> },
        { path: "/flight/details", element: <FlightDetailsPage /> },

        // Hotels & Cars (reserved for future use)
        { path: "/Hotels", element: <LandingHotels /> },
        { path: "/Car", element: <LandingCar /> },
        { path: "/HotelsInner", element: <HotelsInner /> },
        { path: "/CarInner", element: <CarInner /> },

        // Info pages
        { path: "/Faq", element: <FaqInner /> },
        { path: "/About", element: <About /> },
        { path: "/Contact", element: <Contact /> },
        { path: "/PrivacyPolicy", element: <PrivacyPolicy /> },
        { path: "/TermsAndConditions", element: <TermsAndConditions /> },
        { path: "/COVID", element: <COVID /> },
        { path: "/Airport", element: <Airport /> },
        { path: "/VisaRequirements", element: <Navigate to="/visa-information" replace /> },

        // Travel Content Hub
        { path: "/travel-guides", element: <TravelGuidesHub /> },
        { path: "/travel-guides/:category", element: <TravelGuidesCategory /> },
        { path: "/travel-guides/:category/:slug", element: <ArticlePage /> },

        // Visa Information Database
        { path: "/visa-information", element: <VisaInformationHub /> },
        { path: "/visa-information/:slug", element: <VisaCountryPage /> },

        // Auth
        { path: "/Login", element: <Login /> },
        { path: "/signup", element: <Singup /> },
        { path: "/Singup", element: <Navigate to="/signup" replace /> },
        { path: "/reset-password", element: <ResetPassword /> },
        { path: "/admin-login", element: <AdminLogin /> },
        // Post-OAuth landing — routes by role (admin → /admin, user → /dashboard)
        { path: "/auth/callback", element: <AuthCallback /> },

        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

export default router;
