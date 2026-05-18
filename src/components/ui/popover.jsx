import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import { X } from "lucide-react";

function Popover({ open: controlledOpen, onOpenChange, children, className }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (newOpen) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  // Create refs for trigger and content
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle click outside to close (but not on trigger)
  useOnClickOutside(popoverRef, (event) => {
    // Don't close if clicking on the trigger
    if (triggerRef.current && triggerRef.current.contains(event.target)) {
      return;
    }
    // Don't close if interacting with Select components (trigger or portaled content)
    if (
      event.target &&
      typeof event.target.closest === "function" &&
      (event.target.closest('[data-slot="select-content"]') ||
        event.target.closest('[data-slot^="select-"]'))
    ) {
      return;
    }
    if (open) setOpen(false);
  });

  // Focus on content when it opens
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.focus();
    }
  }, [open]);

  // Clone children and pass necessary props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const displayName = child.type.displayName || child.type.name;

    if (displayName === "PopoverTrigger") {
      return React.cloneElement(child, {
        onClick: (e) => {
          e.stopPropagation();
          setOpen(!open);
        },
        ref: triggerRef,
        "aria-expanded": open,
        "aria-haspopup": "dialog",
      });
    }

    if (displayName === "PopoverContent") {
      return React.cloneElement(child, {
        open,
        ref: contentRef,
        onClose: () => setOpen(false),
        "data-state": open ? "open" : "closed",
      });
    }

    return child;
  });

  return (
    <div ref={popoverRef} className={cn("tw:relative", className)}>
      {childrenWithProps}
    </div>
  );
}

Popover.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

// Popover Trigger
const PopoverTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("tw:cursor-pointer", className)}
        data-slot="popover-trigger"
        {...props}
      >
        {children}
      </div>
    );
  },
);

PopoverTrigger.displayName = "PopoverTrigger";

PopoverTrigger.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  asChild: PropTypes.bool,
};

// Popover Content
const PopoverContent = React.forwardRef(
  (
    {
      className,
      open,
      align = "end",
      sideOffset = 8,
      // Mobile modal props
      mobile = true,
      mobileTitle,
      footer,
      mobileBreakpoint = 1024, // eslint-disable-line no-unused-vars -- Kept for backward compatibility
      onClose,
      ...props
    },
    ref,
  ) => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery(
      "(min-width: 768px) and (max-width: 1279px)",
    );
    // Local ref to read DOM metrics while still forwarding parent ref
    const innerRef = React.useRef(null);
    const setRefs = (node) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    // Desktop popover variant with alignment flipping if overflowing
    const [desktopAlign, setDesktopAlign] = useState(align);
    useEffect(() => {
      if (!open) return;
      const checkOverflow = () => {
        if (!innerRef.current) return;
        const rect = innerRef.current.getBoundingClientRect();
        const gutter = 4;
        if (rect.right > window.innerWidth - gutter) {
          setDesktopAlign("start");
        } else if (rect.left < gutter) {
          setDesktopAlign("end");
        } else {
          setDesktopAlign(align);
        }
      };
      // Run once after mount and on resize while open
      setTimeout(checkOverflow, 0);
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
    }, [open, align]);

    // Body scroll lock and focus trap for mobile modal
    useEffect(() => {
      if (!(open && mobile && (isMobile || isTablet))) return;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus trap
      const getFocusable = () => {
        if (!innerRef.current) return [];
        const selectors = [
          "a[href]",
          "area[href]",
          "input:not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          "button:not([disabled])",
          "iframe",
          "object",
          "embed",
          "[contenteditable]",
          '[tabindex]:not([tabindex="-1"])',
        ].join(",");
        return Array.from(innerRef.current.querySelectorAll(selectors));
      };

      // Initial focus
      const previouslyFocused = document.activeElement;
      const focusables = getFocusable();
      if (focusables.length) {
        focusables[0].focus();
      } else if (innerRef.current) {
        innerRef.current.setAttribute("tabindex", "-1");
        innerRef.current.focus();
      }

      const onKeyDown = (e) => {
        if (e.key !== "Tab") return;
        const items = getFocusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      innerRef.current?.addEventListener("keydown", onKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        innerRef.current?.removeEventListener("keydown", onKeyDown);
        if (previouslyFocused && previouslyFocused instanceof HTMLElement) {
          previouslyFocused.focus();
        }
      };
    }, [open, mobile, isMobile, isTablet]);
    if (!open) return null;

    // Mobile modal variant (<768px) - Bottom sheet with expanding middle
    if (mobile && isMobile) {
      return (
        <div
          data-slot="popover-mobile-root"
          className={cn(
            "tw:fixed tw:inset-0 tw:pt-[64px] tw:z-[60] tw:flex tw:items-end tw:justify-center tw:pointer-events-auto",
          )}
        >
          <div
            data-slot="popover-overlay"
            className={cn(
              "tw:absolute tw:inset-0 tw:bg-black/40 tw:transition-opacity tw:duration-200 tw:ease-out tw:animate-in tw:fade-in-0",
            )}
            onClick={onClose}
          />
          <div
            ref={setRefs}
            data-slot="popover-content"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={cn(
              "tw:relative tw:w-full tw:max-h-full tw:bg-white tw:rounded-t-2xl tw:shadow-2xl tw:flex tw:flex-col",
              "tw:animate-in tw:slide-in-from-bottom-full tw:duration-300 tw:ease-out",
            )}
          >
            {/* Header - fixed */}
            <div className="tw:flex-shrink-0 tw:bg-white tw:border-b tw:border-muted tw:px-4 tw:py-3 tw:flex tw:items-center tw:mb-4 tw:md:mb-0 tw:justify-between tw:md:rounded-t-2xl">
              <div className="tw:text-base tw:font-semibold">{mobileTitle}</div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="tw:p-2 tw:rounded-md hover:tw:bg-muted/50 tw:transition"
              >
                <X className="tw:size-5" />
              </button>
            </div>
            {/* Middle - expands to fill available space */}
            <div className="tw:flex-1 tw:overflow-y-auto tw:px-4 tw:py-3 tw:min-h-0">
              {props.children}
            </div>
            {/* Footer - fixed */}
            {footer ? (
              <div className="tw:flex-shrink-0 tw:bg-white tw:border-t tw:border-muted tw:px-4 tw:py-3">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    // Tablet modal variant (768px-1280px) - Centered modal with zoom effect
    if (mobile && isTablet) {
      return (
        <div
          data-slot="popover-modal-root"
          className={cn(
            "tw:fixed tw:inset-0 tw:z-[60] tw:flex tw:items-center tw:justify-center tw:pointer-events-auto tw:p-4",
          )}
        >
          <div
            data-slot="popover-overlay"
            className={cn(
              "tw:absolute tw:inset-0 tw:bg-black/40 tw:transition-opacity tw:duration-200 tw:ease-out tw:animate-in tw:fade-in-0",
            )}
            onClick={onClose}
          />
          <div
            ref={setRefs}
            data-slot="popover-content"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={cn(
              "tw:relative tw:w-auto tw:max-w-[95vw] tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:transition tw:duration-200 tw:ease-out tw:animate-in tw:zoom-in-95 tw:fade-in-0 tw:flex tw:flex-col",
            )}
          >
            {/* Header */}
            <div className="tw:flex-shrink-0 tw:bg-white tw:border-b tw:border-muted tw:px-4 tw:py-2 tw:flex tw:items-center tw:justify-between tw:rounded-t-2xl">
              <div className="tw:text-base tw:font-semibold">{mobileTitle}</div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="tw:p-2 tw:rounded-md hover:tw:bg-muted/50 tw:transition"
              >
                <X className="tw:size-5" />
              </button>
            </div>
            {/* Middle - scrollable with auto height */}
            <div className="tw:flex-1 tw:overflow-y-auto tw:px-4 tw:py-4 tw:min-h-0 tw:min-w-[320px]">
              {props.children}
            </div>
            {/* Footer */}
            {footer ? (
              <div className="tw:flex-shrink-0 tw:bg-white tw:border-t tw:border-muted tw:px-4 tw:py-3 tw:rounded-b-2xl">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    // Desktop popover variant (≥1280px) - unchanged
    return (
      <div
        ref={setRefs}
        data-slot="popover-content"
        tabIndex={-1}
        style={{ marginTop: `${sideOffset}px` }}
        className={cn(
          "tw:absolute tw:min-w-[320px] tw:!w-max tw:border tw:border-muted tw:data-[state=open]:animate-in tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:fade-in-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:zoom-in-95 tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:bg-white tw:shadow-lg tw:rounded-lg tw:z-[9999] tw:p-3 tw:outline-none",
          (desktopAlign || align) === "start" && "tw:left-0 tw:origin-top-left",
          (desktopAlign || align) === "center" &&
            "tw:left-1/2 tw:transform tw:-translate-x-1/2 tw:origin-top",
          (desktopAlign || align) === "end" && "tw:right-0 tw:origin-top-right",
          className,
        )}
        {...props}
      >
        {props.children}
        {footer ? (
          <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mt-2">
            {footer}
          </div>
        ) : null}
      </div>
    );
  },
);

PopoverContent.displayName = "PopoverContent";

PopoverContent.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  align: PropTypes.oneOf(["start", "center", "end"]),
  sideOffset: PropTypes.number,
  children: PropTypes.node,
  mobile: PropTypes.bool,
  mobileTitle: PropTypes.node,
  footer: PropTypes.node,
  mobileBreakpoint: PropTypes.number,
  onClose: PropTypes.func,
};

export { Popover, PopoverContent, PopoverTrigger };
