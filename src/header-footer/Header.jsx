import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Modal } from "@/components/ui/modal";
import { LucideX, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { TfiWorld } from "react-icons/tfi";
import { useMediaQuery } from "usehooks-ts";
import RegionModal from "@/components/RegionModal/RegionModal";
import { useRegionalSettings } from "../context/RegionalSettingsContext";
import { useTranslation } from "react-i18next";
import NewLoginForm from "@/components/ui/auth/new-login-form";
import NewRegisterForm from "@/components/ui/auth/new-register-form";
import { motion, AnimatePresence } from "framer-motion";
import { RiLoginCircleLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useSession, useSignOut } from "@/hooks/useAuth";

const Header = () => {
  const [openAuthModal, setAuthModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)", {
    initializeWithValue: false,
  });
  const [openRegionModal, setOpenRegionModal] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const userMenuRef = useRef(null);

  const { regionalSettings, isLoaded } = useRegionalSettings();
  const { i18n } = useTranslation();

  // Get user session
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  // Sign out mutation
  const signOutMutation = useSignOut();

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        setOpenUserMenu(false);
        window.location.href = "/";
      },
    });
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const siteNavigation = [
    {
      id: 1,
      heading: "Pages",
      list: [
        { id: 1, title: "Home", link: "/" },
        { id: 2, title: "About", link: "/About" },
        { id: 3, title: "FAQ", link: "/Faq" },
        { id: 4, title: "Contact", link: "/Contact" },
      ],
    },
    {
      id: 2,
      heading: "Flights",
      list: [
        { id: 1, title: "Main Deals", link: "/#flight-main-deals" },
        { id: 2, title: "Articles", link: "/#flight-article" },
        { id: 3, title: "Frequently Asked Questions", link: "/#flight-faq" },
        {
          id: 4,
          title: "Begin Your Journey Today",
          link: "/#flight-begin-Journey",
        },
      ],
    },
    {
      id: 3,
      heading: "Hotel",
      list: [
        {
          id: 1,
          title: "Main Deals",
          link: "/Hotels#hotel-main-deals",
          disabled: true,
        },
        {
          id: 2,
          title: "Articles",
          link: "/Hotels#hotel-article",
          disabled: true,
        },
        {
          id: 3,
          title: "Frequently Asked Questions",
          link: "/Hotels#hotel-faq",
          disabled: true,
        },
        {
          id: 4,
          title: "Extended Hotel Options",
          link: "/Hotels#extended-hotel",
          disabled: true,
        },
      ],
    },
    {
      id: 4,
      heading: "Car",
      list: [
        {
          id: 1,
          title: "Main Deals",
          link: "/Car#car-main-deals",
          disabled: true,
        },
        { id: 2, title: "Articles", link: "/Car#car-article", disabled: true },
        {
          id: 3,
          title: "Frequently Asked Questions",
          link: "/Car#car-faq",
          disabled: true,
        },
        {
          id: 4,
          title: "Begin Your Toad Trip Journey",
          link: "/Car#begin-Journey",
          disabled: true,
        },
      ],
    },
    {
      id: 5,
      heading: "Activity",
      list: [
        { id: 1, title: "Visa requirements", link: "/VisaRequirements" },
        { id: 2, title: "Nearest airport details", link: "/Airport" },
        { id: 3, title: "Article", link: "#" },
      ],
    },
  ];

  return (
    <>
      <header
        className="tw:!py-0 tw:!w-full tw:!fixed tw:!top-0 tw:z-[100]"
        inert={openMenu || openAuthModal || openRegionModal ? "" : undefined}
      >
        {/* Top Bar */}
        {/* <div className="tw:h-[48px] tw:flex tw:items-center tw:bg-[#353978]">
          <div className="container">
            <div className="tw:flex tw:items-center tw:justify-between">
              <div className="tw:flex tw:items-center tw:gap-4">
                <Link to="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/icons/dribbble.svg"
                    alt="Dribbble"
                    className="tw:size-5"
                  />
                </Link>
                <Link to="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/icons/youtube.svg"
                    alt="Youtube"
                    className="tw:size-5"
                  />
                </Link>
                <Link to="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/icons/facebook.svg"
                    alt="Facebook"
                    className="tw:size-5"
                  />
                </Link>
              </div>
              <Link
                to="mailto:flyarzan@mail.com"
                className="tw:flex tw:items-center tw:gap-2 tw:!no-underline tw:!text-white"
              >
                <img src="/icons/sms.svg" alt="Mail" className="tw:!size-5" />
                <p>flyarzan@mail.com</p>
              </Link>
            </div>
          </div>
        </div> */}

        {/* Navigation */}
        <div className="tw:h-16 tw:md:h-[92px] tw:bg-white tw:flex tw:items-center tw:shadow">
          <div className="container">
            <div className="tw:flex tw:items-center tw:justify-between">
              <Link to="/">
                <img src="/logo.png" className="tw:w-[120px] tw:md:w-[195px]" />
              </Link>
              <div className="tw:flex tw:justify-between tw:items-center tw:gap-3 tw:md:gap-6">
                <button
                  className="tw:md:flex tw:items-center tw:md:gap-2 tw:text-xl tw:font-medium"
                  onClick={() => setOpenRegionModal(true)}
                >
                  <TfiWorld className="tw:size-5 md:tw:size-6" />
                  <span className="tw:hidden tw:md:block tw:whitespace-nowrap">
                    {!isLoaded
                      ? "Loading..."
                      : `${(
                          regionalSettings?.language?.code ||
                          i18n?.language ||
                          "en-US"
                        )
                          .toUpperCase()
                          .replace(/-.*/, "")} - ${
                          regionalSettings?.currency?.symbol || "$"
                        }`}
                  </span>
                </button>
                {/* User Auth Section */}
                {isSessionLoading ? (
                  // Loading state
                  <div className="tw:w-[100px] tw:h-[40px] tw:bg-gray-200 tw:animate-pulse tw:rounded-md" />
                ) : isAuthenticated ? (
                  // Logged in - Show user menu
                  <div className="tw:relative" ref={userMenuRef}>
                    <button
                      onClick={() => setOpenUserMenu(!openUserMenu)}
                      className="tw:inline-flex tw:items-center tw:gap-2 tw:py-1.5 tw:px-2 tw:md:px-3 tw:rounded-full tw:hover:bg-gray-100 tw:transition-colors"
                    >
                      {/* Avatar */}
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="tw:w-8 tw:h-8 tw:rounded-full tw:object-cover"
                        />
                      ) : (
                        <div className="tw:w-8 tw:h-8 tw:rounded-full tw:bg-primary tw:flex tw:items-center tw:justify-center tw:text-white tw:text-sm tw:font-medium">
                          {getUserInitials(user?.name)}
                        </div>
                      )}
                      <span className="tw:hidden tw:md:block tw:text-sm tw:font-medium tw:text-gray-700 tw:max-w-[100px] tw:truncate">
                        {user?.name?.split(" ")[0] || "User"}
                      </span>
                      <ChevronDown
                        size={16}
                        className="tw:hidden tw:md:block tw:text-gray-500"
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {openUserMenu && (
                      <div className="tw:absolute tw:right-0 tw:top-full tw:mt-2 tw:w-56 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-gray-200 tw:py-2 tw:z-50">
                        {/* User Info */}
                        <div className="tw:px-4 tw:py-2 tw:border-b tw:border-gray-100">
                          <p className="tw:text-sm tw:font-medium tw:text-gray-900 tw:truncate">
                            {user?.name || "User"}
                          </p>
                          <p className="tw:text-xs tw:text-gray-500 tw:truncate">
                            {user?.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="tw:py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setOpenUserMenu(false)}
                            className="tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-2 tw:text-sm tw:text-gray-700 tw:hover:bg-gray-50 tw:!no-underline"
                          >
                            <User size={16} />
                            My Dashboard
                          </Link>
                          <Link
                            to="/dashboard/settings"
                            onClick={() => setOpenUserMenu(false)}
                            className="tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-2 tw:text-sm tw:text-gray-700 tw:hover:bg-gray-50 tw:!no-underline"
                          >
                            <Settings size={16} />
                            Settings
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="tw:border-t tw:border-gray-100 tw:pt-1">
                          <button
                            onClick={handleSignOut}
                            disabled={signOutMutation.isPending}
                            className="tw:flex tw:items-center tw:gap-3 tw:w-full tw:px-4 tw:py-2 tw:text-sm tw:text-red-600 tw:hover:bg-red-50 tw:disabled:opacity-50"
                          >
                            <LogOut size={16} />
                            {signOutMutation.isPending
                              ? "Signing out..."
                              : "Sign Out"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Not logged in - Show login button
                  <button
                    onClick={() => setAuthModal(true)}
                    className="tw:inline-flex tw:items-center tw:gap-1 tw:bg-primary tw:hover:bg-primary/90 tw:shadow-[0_2px_4px_0_rgba(165,163,174,0.30)] tw:py-2.5 tw:md:py-[10px] tw:md:px-5 tw:px-3 tw:!text-sm tw:!text-white tw:!rounded-md"
                  >
                    <span className="tw:hidden tw:md:block">
                      Register / Login
                    </span>
                    <RiLoginCircleLine size={20} className="tw:md:hidden" />
                  </button>
                )}
                <button
                  className="tw:flex tw:gap-2 tw:text-xl tw:font-medium"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <HiMenuAlt3 size={25} />
                  <span className="tw:hidden tw:md:block">Menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Drawer */}
      <Drawer
        open={openMenu}
        onOpenChange={setOpenMenu}
        direction={isMobile ? "right" : "top"}
      >
        <DrawerContent
          side={isMobile ? "right" : "top"}
          className="tw:bg-[#f2faffe0] tw:backdrop-blur-xs"
        >
          <DrawerHeader>
            <div className="flex flex-col">
              <DrawerTitle className="text-xl font-medium sr-only">
                Brand Logo
              </DrawerTitle>
              <img src="/logo.png" className="tw:w-[140px]" />
              <DrawerDescription className="sr-only">
                Mobile sidebar navigation
              </DrawerDescription>
            </div>
            <DrawerClose>
              <X />
            </DrawerClose>
          </DrawerHeader>
          <div className="tw:p-6 tw:lg:p-14 tw:overflow-y-auto">
            <div className="tw:flex tw:justify-around tw:flex-col tw:lg:flex-row tw:gap-6 tw:lg:gap-10">
              {siteNavigation.map(({ id, heading, list }) => (
                <div className="tw:flex tw:flex-col" key={id}>
                  <h5 className="tw:!text-2xl tw:lg:!text-3xl tw:font-semibold tw:!text-dark-purple tw:mb-4">
                    {heading}
                  </h5>
                  <div className="tw:flex tw:flex-col tw:gap-3">
                    {list.map(({ id, title, link, disabled }) =>
                      disabled ? (
                        <span
                          key={id}
                          className="tw:cursor-not-allowed tw:text-xl tw:!no-underline tw:!text-dark-purple tw:hover:tw:text-primary tw:transition-colors"
                        >
                          {title}
                        </span>
                      ) : (
                        <Link
                          to={link}
                          key={id}
                          className="tw:text-xl tw:!no-underline tw:!text-dark-purple tw:hover:tw:text-primary tw:transition-colors"
                          onClick={() => setOpenMenu(false)}
                        >
                          {title}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Auth Modal */}
      <Modal isOpen={openAuthModal} onClose={setAuthModal}>
        <div className="tw:flex tw:justify-between tw:items-start tw:text-secondary tw:mb-4">
          <img src="/logo.png" className="tw:!w-[120px] tw:md:!w-[150px]" />
          <button onClick={() => setAuthModal(false)}>
            <LucideX />
          </button>
        </div>
        <div className="tw:relative tw:w-full tw:overflow-x-hidden px-1">
          <AnimatePresence initial={false} mode="wait">
            {showLogin ? (
              <motion.div
                key="login"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                layout
              >
                <NewLoginForm onSuccess={() => setAuthModal(false)} />
                <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-1 tw:text-center">
                  <span className="tw:text-secondary">
                    Don&apos;t have an account?
                  </span>
                  <button
                    onClick={() => setShowLogin(false)}
                    className="tw:!text-dark-purple tw:hover:!underline tw:focus-visible:underline tw:focus-visible:outline-hidden"
                  >
                    Sign Up
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                layout
              >
                <NewRegisterForm onSuccess={() => setShowLogin(true)} />
                <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-1 tw:text-center">
                  <span className="tw:text-secondary">
                    Already have an account?
                  </span>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="tw:!text-dark-purple tw:hover:!underline tw:focus-visible:underline tw:focus-visible:outline-hidden"
                  >
                    Log in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>

      {/* Region Settings Modal (Language/Currency/Country) */}
      <Modal isOpen={openRegionModal} onClose={setOpenRegionModal}>
        <RegionModal setModal={setOpenRegionModal} />
      </Modal>
    </>
  );
};

export default Header;
