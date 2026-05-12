import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerHeader,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { useSidebarFilter } from "@/providers/filter-sidebar-provider";

const SearchFilterSidebar = ({ flightOffersData, FilterComponent }) => {
  const { isMobile, openMobile, setOpenMobile } = useSidebarFilter();

  if (!FilterComponent) {
    return null; // or a loading state
  }

  if (isMobile) {
    return (
      <Drawer open={openMobile} onOpenChange={setOpenMobile}>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex flex-col">
              <DrawerTitle className="text-xl font-medium sr-only">
                Brand Logo
              </DrawerTitle>
              <img src="/logo.png" alt="Fly Arzan" />
              <DrawerDescription className="sr-only">
                Mobile sidebar navigation
              </DrawerDescription>
            </div>
            <DrawerClose>
              <X />
            </DrawerClose>
          </DrawerHeader>
          <div className="tw:p-4 tw:overflow-y-auto">
            <FilterComponent flightOffersData={flightOffersData} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return <FilterComponent flightOffersData={flightOffersData} />;
};

export default SearchFilterSidebar;
