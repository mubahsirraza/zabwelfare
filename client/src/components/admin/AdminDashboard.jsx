import AdminDrives from "./AdminDrives.jsx";
import { useState } from "react";
import {
  LayoutDashboard,
  HeartHandshake,
  Images,
  Users,
  Newspaper,
  HandCoins,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ArrowUpRight,
  Plus,
  Activity,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Drives", icon: HeartHandshake },
  { label: "Gallery", icon: Images },
  { label: "Team", icon: Users },
  { label: "News & Updates", icon: Newspaper },
  { label: "Donations", icon: HandCoins },
];

const activities = [
  {
    title: "Admin dashboard is ready",
    description: "Your content management workspace is available.",
    time: "Just now",
    icon: CheckCircle2,
  },
  {
    title: "CMS modules pending setup",
    description: "Drives, gallery, team and news will appear here.",
    time: "Next step",
    icon: Activity,
  },
];

function StatCard({ title, value, note, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-xl bg-sky-50 p-2.5 text-sky-700">
          <Icon size={20} />
        </div>
      </div>
      <h3 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>
      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </div>
  );
}

export default function AdminDashboard({ admin, onLogout }) {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = admin?.name || "Administrator";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleNavigation = (label) => {
    setActivePage(label);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FB] text-slate-800">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#142B3B] text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#38A9E8]">
              <HeartHandshake size={23} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">ZABWelfare</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Admin Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-slate-300 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(({ label, icon: Icon }) => {
              const active = activePage === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleNavigation(label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-[#38A9E8] text-white shadow-lg shadow-sky-950/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => handleNavigation("Settings")}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              activePage === "Settings"
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Settings size={19} />
            Settings
          </button>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38A9E8] text-sm font-bold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs capitalize text-slate-400">
                {admin?.role?.replace("_", " ") || "Administrator"}
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              title="Logout"
              className="text-slate-400 transition hover:text-red-300"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[260px]">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {activePage}
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                ZABWelfare content management system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <Search size={16} className="text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E63946]" />
            </button>
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-800 sm:flex">
              {initials}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {activePage === "Overview" ? (
            <>
              <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-slate-500">Welcome back,</p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {displayName}
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Manage your welfare activities and website content.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigation("Drives")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12577E]"
                >
                  <Plus size={18} />
                  Create a Drive
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Drives"
                  value="—"
                  note="Drive records will appear here"
                  icon={HeartHandshake}
                />
                <StatCard
                  title="Gallery Images"
                  value="—"
                  note="Uploaded images will appear here"
                  icon={Images}
                />
                <StatCard
                  title="Team Members"
                  value="—"
                  note="Published team members"
                  icon={Users}
                />
                <StatCard
                  title="Donations"
                  value="—"
                  note="Donation records will appear here"
                  icon={HandCoins}
                />
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Recent Activity
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Updates from your administration workspace
                      </p>
                    </div>
                    <Activity size={20} className="text-sky-600" />
                  </div>

                  <div className="mt-6 space-y-5">
                    {activities.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                            <Icon size={19} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-800">
                                {item.title}
                              </p>
                              <span className="text-xs text-slate-400">
                                {item.time}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-2xl bg-[#176B9A] p-6 text-white shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <CalendarDays size={22} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">
                    Keep your website updated
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Publish welfare drives, share recent activities, and keep
                    your community informed.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavigation("Drives")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#176B9A] transition hover:bg-sky-50"
                  >
                    Manage content
                    <ArrowUpRight size={17} />
                  </button>
                </section>
              </div>
            </>
                 ) : activePage === "Drives" ? (
            <AdminDrives />
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                {(() => {
                  const item = navigation.find(
                    (entry) => entry.label === activePage
                  );
                  const Icon = item?.icon || Settings;
                  return <Icon size={23} />;
                })()}
              </div>
              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                {activePage}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                This section is ready for development. We'll connect it to the
                backend and build its management features in the next steps.
              </p>
              <button
                type="button"
                onClick={() => setActivePage("Overview")}
                className="mt-6 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#12577E]"
              >
                Back to Overview
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
