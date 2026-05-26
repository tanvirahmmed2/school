import PortalNavbar from "@/components/portal/PortalNavbar";
import PortalSidebar from "@/components/portal/PortalSidebar";

const NAV_ITEMS = [
  { name: "Overview",       path: "/portal/student",           icon: "🏠" },
  { name: "My Profile",     path: "/portal/student/profile",   icon: "👤" },
  { name: "Attendance",     path: "/portal/student/attendance",icon: "✅" },
  { name: "Results",        path: "/portal/student/results",   icon: "📝" },
  { name: "Fee History",    path: "/portal/student/fees",      icon: "💳" },
  { name: "Class Schedule", path: "/portal/student/schedule",  icon: "📅" },
  { name: "Notices",        path: "/portal/student/notices",   icon: "📢" },
];

const USER = {
  name:     "Sakib Hasan",
  subtitle: "Class 5 · Roll 101",
  initial:  "S",
};

const BRAND = { label: "Student Portal" };

export const metadata = {
  title: { template: "%s | Student Portal", default: "Student Portal" },
};

export default function StudentPortalLayout({ children }) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--portal-bg)" }}
    >
      <PortalSidebar navItems={NAV_ITEMS} user={USER} brand={BRAND} accent="indigo" />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <PortalNavbar
          title="Student Portal"
          userColor="#4F46E5"
          userInitial="S"
          userName="Sakib Hasan"
          userSub="Class 5 · Roll 101"
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
