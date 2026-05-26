import PortalNavbar from "@/components/portal/PortalNavbar";
import PortalSidebar from "@/components/portal/PortalSidebar";

const NAV_ITEMS = [
  { name: "Overview",        path: "/portal/teacher",            icon: "🏠" },
  { name: "My Profile",      path: "/portal/teacher/profile",    icon: "👤" },
  { name: "Class Schedule",  path: "/portal/teacher/schedule",   icon: "📅" },
  { name: "Mark Attendance", path: "/portal/teacher/attendance", icon: "✅" },
  { name: "Student Reports", path: "/portal/teacher/students",   icon: "🎓" },
  { name: "Salary",          path: "/portal/teacher/salary",     icon: "💰" },
  { name: "Notices",         path: "/portal/teacher/notices",    icon: "📢" },
];

const USER = {
  name:         "Md. Rafiqul Islam",
  subtitle:     "Head Teacher",
  initial:      "R",
  gradientFrom: "#7C3AED",
  gradientTo:   "#4F46E5",
};

const BRAND = { label: "Teacher Portal" };

export const metadata = {
  title: { template: "%s | Teacher Portal", default: "Teacher Portal" },
};

export default function TeacherPortalLayout({ children }) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--portal-bg)" }}
    >
      <PortalSidebar navItems={NAV_ITEMS} user={USER} brand={BRAND} accent="violet" />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <PortalNavbar
          title="Teacher Portal"
          userColor="#7C3AED"
          userInitial="R"
          userName="Md. Rafiqul Islam"
          userSub="Head Teacher"
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
