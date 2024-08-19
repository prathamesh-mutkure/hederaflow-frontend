import type { DashboardConfig } from "@/app/types/index";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "User",
      href: "/dashboard/user",
    },
    {
      title: "Consulate",
      href: "/dashboard/admin",
    },
  ],
  userSidebarNav: [
    {
      title: "Dashboard",
      href: "/organization-dashboard",
      icon: "home",
    },
    {
      title: "All Employees",
      href: "/organization-users",
      icon: "home",
    },
    {
      title: "Add Employee",
      href: "/add-users",
      icon: "home",
    },
    {
      title: "All Payroll",
      href: "/organization-payroll-list",
      icon: "home",
    },
    {
      title: "Create Payroll",
      href: "/organization-payroll",
      icon: "home",
    },
    {
      title: "Payroll Invoices",
      href: "/organization-payment-history",
      icon: "home",
    },
    {
      title: "Deposits",
      href: "/organization-deposit",
      icon: "home",
    },
    {
      title: "Organization Profile",
      href: "/organization-profile",
      icon: "home",
    },
  ],
  adminSidebarNav: [
    {
      title: "Organization",
      href: "/dashboard/user/visa",
      icon: "home",
    },
  ],
  sidebarNav: [],
  sidebarNavBidder: [],
};
