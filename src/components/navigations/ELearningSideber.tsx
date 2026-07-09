"use client";

import * as Avatar from "@radix-ui/react-avatar";
import {
  Home,
  Users,
  MessageSquare,
  Send,
  UserCheck,
  ChevronDown,
  ExternalLink,
  History,
  Lock,
  X,
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
  BarChart3,
  Settings,
  Building2,
  UserCog,
  ClipboardList,
  PlusCircle,
  Inbox,
  FileQuestion,
  DollarSign,
  FileText,
  Megaphone,
  Bell,
  Mail,
  BookOpen,
  Award,
  GraduationCap,
  FolderTree,
  Star,
  Layout,
  Shield,
  Video,
  MonitorPlay,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  FolderOpen,
  Upload,
  FileCheck,
  CheckCircle,
  LogOut,
  User,
  Power,
  MessageCircle,
  ImageIcon,
} from "lucide-react";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { useEffect, useState } from "react";
import homeLogo from '../../../public/The_Logo/linuxeon_logo.png';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import { useGetEnterpriseByIdQuery } from "@/redux/api/authentication/authApi";
import { getUserInfo } from "@/utils/helper/userFromToken";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { useGetSubCompanyByIdQuery } from "@/redux/api/authentication/subCompanyApi";
import { FaSms, FaWhatsapp } from "react-icons/fa";

interface EnterpriseSidebarProps {
  isOpen?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  isOpen = true,
  onToggleSidebar,
  isMobile = false,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfo();
      if (!userInfo) {
        router.push("/");
      } else {
        setUser(userInfo);
      }
    };
    fetchUser();
  }, [router]);

  const handleProfileRedirect = () => {
    router.push(`/admin/update-profile/${user?.id}`);
  }

  // Conditional API calls based on user role
  const shouldUseSubCompanyApi = user?.role === "accreditation-body";

  // Fetch enterprise data using the enterprise ID (for brother-enterprise role)
  const { data: enterpriseData, isLoading: isEnterpriseLoading } = useGetEnterpriseByIdQuery(
    user?.id || "",
    {
      skip: !user?.id || shouldUseSubCompanyApi,
    }
  );

  // Fetch sub-company data using the sub-company ID (for accreditation-body role)
  const { data: subCompanyData, isLoading: isSubCompanyLoading } = useGetSubCompanyByIdQuery(
    user?.id || "",
    {
      skip: !user?.id || !shouldUseSubCompanyApi,
    }
  );

  // Determine which data to use based on role
  const isLoading = shouldUseSubCompanyApi ? isSubCompanyLoading : isEnterpriseLoading;
  const userData = shouldUseSubCompanyApi ? subCompanyData?.data : enterpriseData?.data;

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync internal state with prop
  useEffect(() => {
    setInternalIsOpen(isOpen);
  }, [isOpen]);

  // Get menu items based on user role
  const getMenuByRole = () => {
    // Brother Enterprise menu items
    // Enterprise Menu Items (for Brother Enterprise / Training Center)
    const enterpriseMenuItems = [
      {
        key: "dashboard",
        icon: <Home size={20} />,
        label: "Dashboard",
        href: "/admin/dashboard",
      },
      {
        key: "company-management",
        icon: <Building2 size={20} />,
        label: "Company Management",
        subItems: [
          {
            key: "pending-companies",
            icon: <Clock size={16} />,
            label: "Pending Companies",
            href: "/admin/companies/pending",
          },
          {
            key: "approved-companies",
            icon: <CheckCircle2 size={16} />,
            label: "Approved Companies",
            href: "/admin/companies/approved",
          },
          {
            key: "rejected-companies",
            icon: <XCircle size={16} />,
            label: "Rejected Companies",
            href: "/admin/companies/rejected",
          },
        ],
      },
      {
        key: "students",
        icon: <Users size={20} />,
        label: "Documents Management",
        subItems: [
          {
            key: "all-students",
            icon: <Users size={16} />,
            label: "Student Document",
            href: "/admin/students/document",
          },
          {
            key: "all-students",
            icon: <Users size={16} />,
            label: "Certification Document",
            href: "/admin/documents/request-documents",
          },
        ],
      },
      {
        key: "certificates",
        icon: <Award size={20} />,
        label: "Certificate Management",
        subItems: [
          {
            key: "issue-certificate",
            icon: <FileText size={16} />,
            label: "Issue Certificate",
            href: "/admin/certificates/issue",
          },
          {
            key: "all-certificates",
            icon: <Award size={16} />,
            label: "All Certificates",
            href: "/admin/certificates/all-certificate",
          },
        ],
      },
      {
        key: "communication",
        icon: <MessageCircle size={20} />,
        label: "Communication",
        subItems: [
          {
            key: "whatsapp-number",
            icon: <FaWhatsapp size={16} />,
            label: "WhatsApp Number",
            href: "/admin/communication/whatsapp-number",
          },
          {
            key: "subscribe-email",
            icon: <Mail size={16} />,
            label: "Subscribe Emails",
            href: "/admin/communication/subscribe-email",
          },
          {
            key: "public-sms",
            icon: <FaSms size={16} />,
            label: "Public SMS",
            href: "/admin/communication/public-sms",
          },
          {
            key: "chatting",
            icon: <MessageSquare size={16} />,
            label: "Chatting",
            href: "/admin/communication/chatting",
          },
        ],
      },
      {
        key: "settings",
        icon: <Settings size={20} />,
        label: "Settings",
        subItems: [
          {
            key: "home-banner",
            icon: <ImageIcon size={16} />,
            label: "Home Banner",
            href: "/admin/settings/home-banner",
          },
          {
            key: "home-banner",
            icon: <ImageIcon size={16} />,
            label: "Staff members",
            href: "/admin/settings/staff-members",
          },
          {
            key: "home-banner",
            icon: <ImageIcon size={16} />,
            label: "Exclusive Creator",
            href: "/admin/settings/exclusive-creator",
          },
        ],
      }
    ];

    // Admin Menu Items (for Super Admin / Platform Owner)
    const adminMenuItems = [
      {
        key: "dashboard",
        icon: <Home size={20} />,
        label: "Dashboard",
        href: "/admin/dashboard",
      },
      {
        key: "documents",
        icon: <FileText size={20} />,
        label: "Document Management",
        subItems: [
          {
            key: "upload-document",
            icon: <Upload size={16} />,
            label: "Upload New",
            href: "/admin/documents/upload-new",
          },
          {
            key: "all-documents",
            icon: <FolderOpen size={16} />,
            label: "All Documents",
            href: "/admin/documents/all",
          },
          {
            key: "pending-documents",
            icon: <CheckCircle size={16} />,
            label: "Approved Documnets",
            href: "/admin/documents/approved",
          },
        ],
      },
    ];

    if (user && user?.role === "brother-enterprise") {
      return enterpriseMenuItems;
    } else if (user && (user?.role === "accreditation-body")) {
      return adminMenuItems;
    } else {
      return [];
    }
  };

  // Get display name based on user role
  const getDisplayName = () => {
    if (isLoading) return "Loading...";
    if (shouldUseSubCompanyApi) {
      return userData?.companyName || user?.companyName;
    }
    return userData?.companyName || user?.companyName;
  };

  // Get display email based on user role
  const getDisplayEmail = () => {
    if (isLoading) return "Loading...";
    if (shouldUseSubCompanyApi) {
      return userData?.email || user?.email;
    }
    return userData?.email || user?.email;
  };

  // Get profile image based on user role
  const getProfileImage = () => {
    if (user?.role === "brother-enterprise") {
      return userData?.ownerPhoto || "";
    } else if (user?.role === "accreditation-body") {
      return userData?.ownerPhoto || "";
    }
    return "";
  };

  // Get profile initial based on user role
  const getProfileInitial = () => {
    if (user?.role === "brother-enterprise") {
      const companyName = userData?.companyName || user?.companyName || "B";
      return companyName.charAt(0);
    } else if (user?.role === "accreditation-body") {
      const companyName = userData?.companyName || user?.companyName || "A";
      return companyName.charAt(0);
    } else if (user?.role === "admin" || user?.role === "super_admin") {
      return user?.fullName?.charAt(0) || "A";
    }
    return "U";
  };

  // Improved isActive function
  const isActive = (href: string) => {
    if (!pathname || !href) return false;

    // For dashboard, exact match
    if (href === "/enterprise/dashboard" || href === "/admin/dashboard") {
      return pathname === href;
    }

    // For other routes, check if current path starts with href
    const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const normalizedHref = href.endsWith('/') ? href.slice(0, -1) : href;

    return normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + '/');
  };

  const handleLogout = () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    shareWithCookies("remove", `${appConfiguration.appCode}refreshToken`);
    router.push("/");
    router.refresh();
  };

  // Auto-open submenu based on current route
  useEffect(() => {
    if (!pathname) return;

    // Check each menu item for subitems that match current path
    for (const item of getMenuByRole()) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (isActive(subItem.href)) {
            setActiveSubmenu(item.key);
            return;
          }
        }
      }
    }

    // If no subitem matches, close all submenus
    setActiveSubmenu(null);
  }, [pathname]);

  // Helper function to check if any subitem is active
  const isActiveSubmenu = (item): boolean => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem: { href: string }) => isActive(subItem.href));
  };

  // Mobile close handler
  const handleMobileClose = () => {
    if (isMobile && onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const displayIsOpen = isMobile ? isOpen : internalIsOpen;

  return (
    <motion.aside
      initial={false}
      animate={{
        width: displayIsOpen ? (isMobile ? "100%" : 260) : 70,
        x: isMobile ? (isOpen ? 0 : -100) : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-xl ${isMobile ? "max-w-xl" : "sticky top-0"
        }`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <Link href={user?.role === "brother-enterprise" ? "/enterprise/dashboard" : "/admin/dashboard"} onClick={handleMobileClose}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: displayIsOpen ? 1 : 0, x: displayIsOpen ? 0 : -20 }}
            transition={{ duration: 0.2 }}
            className={`${!displayIsOpen && "hidden"}`}
          >
            {mounted && (
              <Image
                src={homeLogo}
                alt="Logo"
                width={800}
                height={800}
                className="w-28 lg:w-full h-auto object-contain"
                priority
              />
            )}
          </motion.div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => onToggleSidebar && onToggleSidebar()}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors md:hidden"
              aria-label="Close menu"
            >
              <X size={22} className="text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {getMenuByRole().map((item) => (
            <li key={item.key} className="px-1">
              {!item.subItems ? (
                <Link
                  href={item.href}
                  onClick={handleMobileClose}
                  className={cn(
                    "flex cursor-pointer items-center px-3 py-3 gap-3 rounded-lg transition-all group",
                    "text-gray-700 hover:bg-gray-100",
                    isActive(item.href) &&
                    "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  <span
                    className={cn(
                      "text-[20px] transition-colors flex-shrink-0",
                      isActive(item.href)
                        ? "text-white"
                        : "text-gray-600 group-hover:text-gray-900"
                    )}
                  >
                    {item.icon}
                  </span>
                  {displayIsOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() =>
                      setActiveSubmenu(
                        activeSubmenu === item.key ? null : item.key
                      )
                    }
                    className={cn(
                      "flex items-center cursor-pointer px-3 py-3 gap-3 w-full rounded-lg transition-all group",
                      "text-gray-700 hover:bg-gray-100",
                      (activeSubmenu === item.key || isActiveSubmenu(item)) &&
                      "bg-gray-100 text-gray-900"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[20px] transition-colors flex-shrink-0",
                        (activeSubmenu === item.key || isActiveSubmenu(item))
                          ? "text-gray-900"
                          : "text-gray-600 group-hover:text-gray-900"
                      )}
                    >
                      {item.icon}
                    </span>
                    {displayIsOpen && (
                      <>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium flex-1 text-left truncate"
                        >
                          {item.label}
                        </motion.span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform text-gray-500 flex-shrink-0",
                            activeSubmenu === item.key ? "rotate-180" : ""
                          )}
                        />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {(activeSubmenu === item.key || isActiveSubmenu(item)) &&
                      item.subItems &&
                      displayIsOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-8 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.subItems.map((subItem, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.1 }}
                            >
                              <Link
                                href={subItem.href}
                                onClick={handleMobileClose}
                                className={cn(
                                  "flex items-center px-3 py-2.5 gap-2 text-sm rounded-lg transition-all group",
                                  "text-gray-700 hover:bg-gray-100",
                                  isActive(subItem.href) &&
                                  "bg-blue-600 text-white hover:bg-blue-700"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-[16px] transition-colors flex-shrink-0",
                                    isActive(subItem.href)
                                      ? "text-white"
                                      : "text-gray-500 group-hover:text-gray-700"
                                  )}
                                >
                                  {subItem.icon}
                                </span>
                                <span className="font-medium truncate">
                                  {subItem.label}
                                </span>
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                  </AnimatePresence>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section and Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Avatar.Root onClick={handleProfileRedirect} className="w-10 hover:cursor-pointer h-10 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
            <Avatar.Image
              src={getProfileImage()}
              alt={getDisplayName()}
              className="object-cover w-full h-full"
            />
            <Avatar.Fallback
              delayMs={600}
              className="bg-gray-200 text-gray-700 flex items-center justify-center w-full h-full"
            >
              {getProfileInitial()}
            </Avatar.Fallback>
          </Avatar.Root>

          {displayIsOpen && (
            <motion.div onClick={handleProfileRedirect}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: displayIsOpen ? 1 : 0, x: displayIsOpen ? 0 : -20 }}
              transition={{ duration: 0.2 }}
              className="text-sm flex-1 min-w-0 hover:cursor-pointer"
            >
              <p className="font-medium text-gray-900 truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {getDisplayEmail()}
              </p>
            </motion.div>
          )}

          {displayIsOpen && (
            <div className="flex items-center gap-1">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 group flex-shrink-0"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/0 to-red-400/0 group-hover:from-red-400/10 group-hover:to-red-400/5 transition-all duration-300" />
                    <MdLogout
                      size={20}
                      className="text-gray-500 group-hover:text-red-500 transition-all duration-300 transform group-hover:rotate-12"
                    />
                  </motion.button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-white border-0 shadow-2xl max-w-[95vw] md:max-w-md mx-auto rounded-2xl overflow-hidden p-0">
                  {/* Animated gradient background */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-orange-50/30"
                  />

                  <div className="relative p-6 md:p-8">
                    {/* Header with animated icon */}
                    <AlertDialogHeader className="space-y-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.1
                        }}
                        className="flex justify-center"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                            <Power size={36} className="text-white" />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                      >
                        <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                          Logout Confirmation
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 mt-2 text-base">
                          Are you sure you want to end your session?
                        </AlertDialogDescription>
                      </motion.div>
                    </AlertDialogHeader>

                    {/* User info */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mb-6 border border-blue-100/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                          <User size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {getDisplayEmail()}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Action buttons */}
                    <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                      <AlertDialogCancel asChild>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-4 py-3 text-black rounded-xl font-medium transition-all duration-200 order-2 sm:order-1"
                        >
                          <span className="text-black">Stay Logged In</span>
                        </motion.button>
                      </AlertDialogCancel>

                      <AlertDialogAction asChild>
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 order-1 sm:order-2"
                        >
                          <motion.span
                            animate={{
                              x: [0, 5, 0],
                              transition: { repeat: Infinity, duration: 0.5, repeatDelay: 2 }
                            }}
                          >
                            <LogOut size={18} />
                          </motion.span>
                          Logout Now
                        </motion.button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default EnterpriseSidebar;