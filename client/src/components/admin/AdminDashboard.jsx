
import AdminDrives from "./AdminDrives.jsx";
import AdminTeam from "./AdminTeam.jsx";
import AdminGallery from "./AdminGallery.jsx";
import AdminNews from "./AdminNews.jsx";
import AdminDonations from "./AdminDonations.jsx";
import AdminVolunteers from "./AdminVolunteers.jsx";
import AdminContacts from "./AdminContacts.jsx";

import { useCallback, useEffect, useState } from "react";

import {
  LayoutDashboard,
  HeartHandshake,
  GalleryVerticalEnd,
  ContactRound,
  Images,
  UsersRound,
  UserRoundPlus,
  Mail,
  Newspaper,
  WalletCards,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ArrowUpRight,
  Plus,
  Activity,
  RefreshCw,
  Clock3,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Sparkles,
  HandCoins,
  CalendarDays,
  CheckCircle2,
  FileText,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    group: "Workspace",
  },
  {
    label: "Drives",
    icon: HeartHandshake,
    group: "Management",
  },
  {
    label: "Gallery",
    icon: Images,
    group: "Management",
  },
  {
    label: "Team",
    icon: UsersRound,
    group: "Management",
  },
  {
    label: "News & Updates",
    icon: Newspaper,
    group: "Management",
  },
  {
    label: "Donations",
    icon: WalletCards,
    group: "Management",
  },
  {
    label: "Volunteers",
    icon: UserRoundPlus,
    group: "Management",
  },
  {
    label: "Contact Messages",
    icon: Mail,
    group: "Management",
  },
];

const emptyDashboardData = {
  drives: [],
  gallery: [],
  team: [],
  news: [],
  donations: [],
  volunteers: [],
  contacts: [],
};

function extractList(data, possibleKeys) {
  if (!data) return [];

  for (const key of possibleKeys) {
    if (Array.isArray(data[key])) return data[key];
    if (Array.isArray(data.data?.[key])) return data.data[key];
  }

  return Array.isArray(data.data) ? data.data : [];
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
  loading,
  color = "sky",
}) {
  const colors = {
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    violet: "bg-sky-50 text-sky-700 ring-sky-100",
    indigo: "bg-sky-50 text-sky-700 ring-sky-100",
    amber: "bg-sky-50 text-sky-700 ring-sky-100",
    emerald: "bg-sky-50 text-sky-700 ring-sky-100",
    cyan: "bg-sky-50 text-sky-700 ring-sky-100",
    orange: "bg-sky-50 text-sky-700 ring-sky-100",
    teal: "bg-sky-50 text-sky-700 ring-sky-100",
  };

  return (
    <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.025)] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_14px_32px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-wide text-slate-500">
            {title}
          </p>

          <div className="mt-4 min-h-[38px]">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
            ) : (
              <h3 className="break-words text-[26px] font-bold tracking-tight text-slate-900">
                {value}
              </h3>
            )}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${colors[color]}`}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-3 text-[11px] font-medium text-slate-400">
        {note}
      </p>
    </div>
  );
}

function SectionHeading({ title, description, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Icon size={19} strokeWidth={1.8} />
        </div>
      )}

      <div className="min-w-0">
        <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
    </div>
  );
}

function DashboardOverview({ admin, onNavigate }) {
  const [dashboardData, setDashboardData] = useState(emptyDashboardData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState([]);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrors([]);

    const token = localStorage.getItem("zabwelfareAdminToken");

    if (!token) {
      setErrors([
        "Admin authentication token was not found. Please log in again.",
      ]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const endpoints = [
      {
        key: "drives",
        path: "/drives/admin/all",
        responseKeys: ["drives"],
        label: "Drives",
      },
      {
        key: "gallery",
        path: "/gallery/admin/all",
        responseKeys: ["images", "gallery"],
        label: "Gallery",
      },
      {
        key: "team",
        path: "/team/admin/all",
        responseKeys: ["members", "team", "teamMembers"],
        label: "Team",
      },
      {
        key: "news",
        path: "/news/admin/all",
        responseKeys: ["news", "articles"],
        label: "News",
      },
      {
        key: "donations",
        path: "/donations/admin/all",
        responseKeys: ["donations"],
        label: "Donations",
      },
      {
        key: "volunteers",
        path: "/volunteers/admin/all",
        responseKeys: ["volunteers"],
        label: "Volunteers",
      },
      {
        key: "contacts",
        path: "/contact/admin/all",
        responseKeys: ["contacts"],
        label: "Contact messages",
      },
    ];

    try {
      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const response = await fetch(`${API_URL}${endpoint.path}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const result = await response.json();

            if (!response.ok || result.success === false) {
              throw new Error(
                result.message || `Unable to load ${endpoint.label}.`
              );
            }

            return {
              key: endpoint.key,
              data: extractList(result, endpoint.responseKeys),
              error: null,
            };
          } catch (error) {
            return {
              key: endpoint.key,
              data: [],
              error: `${endpoint.label}: ${error.message}`,
            };
          }
        })
      );

      const updatedData = { ...emptyDashboardData };
      const failedRequests = [];

      results.forEach((result) => {
        updatedData[result.key] = result.data;

        if (result.error) {
          failedRequests.push(result.error);
        }
      });

      setDashboardData(updatedData);
      setErrors(failedRequests);
    } catch {
      setErrors([
        "Unable to load dashboard information. Please try again.",
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const {
    drives,
    gallery,
    team,
    news,
    donations,
    volunteers,
    contacts,
  } = dashboardData;

  const pendingDonations = donations.filter(
    (item) => item.status === "Pending"
  );

  const pendingVolunteers = volunteers.filter(
    (item) => item.status === "Pending"
  );

  const newContacts = contacts.filter(
    (item) => item.status === "New"
  );

  const verifiedDonations = donations.filter(
    (item) => item.status === "Verified"
  );

  const verifiedAmount = verifiedDonations.reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0
  );

  const pendingReviews =
    pendingDonations.length +
    pendingVolunteers.length +
    newContacts.length;

  const publishedDrives = drives.filter(
    (item) => item.status === "published"
  );

  const publishedNews = news.filter(
    (item) => item.status === "Published"
  );

  const recentActivity = [
    ...donations.map((item) => ({
      id: `donation-${item._id}`,
      title: `Donation from ${item.donorName || "Anonymous donor"}`,
      description: `${formatCurrency(item.amount)} · ${item.status || "Pending"}`,
      date: item.createdAt,
      icon: HandCoins,
      type: "Donation",
      iconStyle: "bg-emerald-50 text-emerald-700",
    })),

    ...volunteers.map((item) => ({
      id: `volunteer-${item._id}`,
      title: `${item.fullName || "New volunteer"} applied`,
      description: `${item.areaOfInterest || "Volunteer application"} · ${item.status || "Pending"}`,
      date: item.createdAt,
      icon: UserRoundPlus,
      type: "Volunteer",
      iconStyle: "bg-sky-50 text-sky-700",
    })),

    ...contacts.map((item) => ({
      id: `contact-${item._id}`,
      title: `Message from ${item.name || "Website visitor"}`,
      description: `${item.subject || "Contact message"} · ${item.status || "New"}`,
      date: item.createdAt,
      icon: Mail,
      type: "Contact",
      iconStyle: "bg-violet-50 text-violet-700",
    })),

    ...drives.map((item) => ({
      id: `drive-${item._id}`,
      title: item.title || "Drive created",
      description: `Welfare drive · ${item.status || "Unspecified status"}`,
      date: item.createdAt,
      icon: HeartHandshake,
      type: "Drive",
      iconStyle: "bg-amber-50 text-amber-700",
    })),

    ...news.map((item) => ({
      id: `news-${item._id}`,
      title: item.title || "News article created",
      description: `News & Updates · ${item.status || "Draft"}`,
      date: item.createdAt || item.publishedAt,
      icon: Newspaper,
      type: "News",
      iconStyle: "bg-violet-50 text-violet-700",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date || 0).getTime() -
        new Date(a.date || 0).getTime()
    )
    .slice(0, 7);

  const stats = [
    {
      title: "Total Drives",
      value: drives.length,
      note: `${publishedDrives.length} published`,
      icon: HeartHandshake,
      color: "sky",
    },
    {
      title: "Gallery Images",
      value: gallery.length,
      note: "Uploaded gallery records",
      icon: GalleryVerticalEnd,
      color: "sky",
    },
    {
      title: "Team Members",
      value: team.length,
      note: "Team records",
      icon: ContactRound,
      color: "sky",
    },
    {
      title: "News Articles",
      value: news.length,
      note: `${publishedNews.length} published`,
      icon: Newspaper,
      color: "amber",
    },
    {
      title: "Total Donations",
      value: donations.length,
      note: `${pendingDonations.length} awaiting verification`,
      icon: WalletCards,
      color: "emerald",
    },
    {
      title: "Volunteer Applications",
      value: volunteers.length,
      note: `${pendingVolunteers.length} awaiting review`,
      icon: UserRoundPlus,
      color: "cyan",
    },
    {
      title: "Contact Messages",
      value: contacts.length,
      note: `${newContacts.length} new messages`,
      icon: Mail,
      color: "violet",
    },
    {
      title: "Pending Reviews",
      value: pendingReviews,
      note: "Donations, volunteers and new messages",
      icon: Clock3,
      color: "orange",
    },
    {
      title: "Verified Donations",
      value: formatCurrency(verifiedAmount),
      note: `${verifiedDonations.length} verified contributions`,
      icon: TrendingUp,
      color: "teal",
    },
  ];

  return (
    <div className="min-w-0 space-y-7">
      {/* Welcome panel */}
      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#12334B] via-[#164C6B] to-[#176B9A] p-6 text-white shadow-[0_14px_40px_rgba(23,75,105,0.16)] sm:p-8 lg:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[38px] border-white/[0.045]" />
        <div className="pointer-events-none absolute -bottom-32 right-[20%] h-64 w-64 rounded-full border-[30px] border-white/[0.035]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/[0.035] to-transparent" />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.09] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-100">
              <Sparkles size={13} />
              Administration workspace
            </div>

            <p className="mt-6 text-sm font-medium text-sky-100/80">
              Welcome back,
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[34px]">
              {admin?.name || "Administrator"}
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-sky-50/75">
              Here's your organisation at a glance. Manage your welfare
              activities, review contributions and keep your community
              connected.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.09] px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/[0.16] disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh data
            </button>

            <button
              type="button"
              onClick={() => onNavigate("Drives")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#155477] shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
            >
              <Plus size={16} />
              Create a drive
            </button>
          </div>
        </div>

        <div className="relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[11px] font-medium text-sky-100/75">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Dashboard connected
          </span>

          <span className="inline-flex items-center gap-2">
            <Activity size={13} />
            Live database records
          </span>

          <span className="inline-flex items-center gap-2">
            <CalendarDays size={13} />
            {new Date().toLocaleDateString("en-PK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </section>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 shrink-0 text-amber-700"
              size={19}
            />

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-amber-900">
                Some information could not be loaded
              </h3>

              <ul className="mt-2 space-y-1 text-xs leading-5 text-amber-800">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => fetchDashboardData(true)}
                className="mt-3 text-xs font-bold text-amber-900 underline underline-offset-4"
              >
                Retry loading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Platform overview
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              A summary of your organisation's activity
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live data
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} loading={loading} />
          ))}
        </div>
      </section>

      {/* Activity and shortcuts */}
      <div className="grid min-w-0 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.025)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <SectionHeading
              title="Recent activity"
              description="The latest updates across your platform"
              icon={Activity}
            />

            <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-500">
              Latest 7
            </span>
          </div>

          {loading ? (
            <div className="mt-7 space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex animate-pulse gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-3.5 w-2/3 rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Activity size={22} strokeWidth={1.7} />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-700">
                Nothing to show yet
              </p>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
                New donations, volunteer applications, contact messages,
                drives and news updates will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {recentActivity.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className="flex min-w-0 items-center gap-3 py-4 first:pt-1 last:pb-1 sm:gap-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-slate-800">
                        {item.title}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {item.type}
                      </span>

                      <span className="mt-1 block text-[11px] text-slate-500">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="relative overflow-hidden rounded-2xl bg-[#142F43] p-6 text-white shadow-[0_12px_30px_rgba(20,47,67,0.12)] sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border-[28px] border-white/[0.045]" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full border-[28px] border-white/[0.035]" />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sky-300 ring-1 ring-white/10">
              <Sparkles size={21} strokeWidth={1.8} />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
              Quick access
            </p>

            <h3 className="mt-2 text-xl font-bold tracking-tight">
              What would you like to manage?
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-300">
              Jump directly to the areas that need your attention.
            </p>

            <div className="mt-6 space-y-2.5">
              {[
                {
                  label: "Manage welfare drives",
                  page: "Drives",
                  icon: HeartHandshake,
                },
                {
                  label: "Review donations",
                  page: "Donations",
                  icon: HandCoins,
                  count: pendingDonations.length,
                },
                {
                  label: "Review volunteers",
                  page: "Volunteers",
                  icon: UserRoundPlus,
                  count: pendingVolunteers.length,
                },
                {
                  label: "View contact messages",
                  page: "Contact Messages",
                  icon: Mail,
                  count: newContacts.length,
                },
                {
                  label: "Publish news",
                  page: "News & Updates",
                  icon: FileText,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => onNavigate(item.page)}
                    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.09] bg-white/[0.045] px-3.5 py-3.5 text-left transition duration-200 hover:border-white/20 hover:bg-white/[0.10]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-sky-300">
                        <Icon size={16} strokeWidth={1.8} />
                      </span>

                      <span className="truncate text-xs font-semibold text-slate-100">
                        {item.label}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-2">
                      {typeof item.count === "number" && item.count > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[9px] font-bold text-white">
                          {item.count}
                        </span>
                      )}

                      <ArrowUpRight
                        size={16}
                        className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-[10px] font-medium text-slate-400">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Your workspace is ready
            </div>
          </div>
        </section>
      </div>
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

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const groupedNavigation = [
    {
      title: "Workspace",
      items: navigation.filter(
        (item) => item.group === "Workspace"
      ),
    },
    {
      title: "Content management",
      items: navigation.filter(
        (item) => item.group === "Management"
      ),
    },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F5F8FB] text-slate-800">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[min(86vw,286px)] flex-col overflow-hidden bg-[#112B3D] text-white shadow-[12px_0_40px_rgba(15,23,42,0.12)] transition-transform duration-300 ease-out lg:w-[272px] lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#55C2F4] to-[#1686BE] text-white shadow-lg shadow-sky-950/30">
              <HeartHandshake size={23} strokeWidth={1.9} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[18px] font-extrabold tracking-tight text-white">
                ZABWelfare
              </h1>

              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Management portal
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Scrollable navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 pb-5 pt-5 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.35)_transparent]">
          {groupedNavigation.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              <p className="mb-2.5 px-3 text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                {group.title}
              </p>

              <nav className="space-y-0.5">
                {group.items.map(({ label, icon: Icon }) => {
                  const active = activePage === label;

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleNavigation(label)}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex min-h-[43px] w-full items-center gap-3 rounded-xl px-3.5 text-left text-[13px] font-semibold transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-[#2599D2] to-[#38A9E8] text-white shadow-[0_5px_18px_rgba(35,153,210,0.22)]"
                          : "text-slate-300 hover:bg-white/[0.065] hover:text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-white" />
                      )}

                      <Icon
                        size={19}
                        strokeWidth={active ? 2.1 : 1.75}
                        className={`shrink-0 transition-colors ${
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-sky-300"
                        }`}
                      />

                      <span className="min-w-0 flex-1 truncate">
                        {label}
                      </span>

                      {active && (
                        <ChevronRight
                          size={15}
                          strokeWidth={2}
                          className="text-white/80"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Preferences */}
          <div className="border-t border-white/[0.08] pt-5">
            <p className="mb-3 px-3 text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
              Preferences
            </p>

            <button
              type="button"
              onClick={() => handleNavigation("Settings")}
              className={`flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3.5 text-left text-[13px] font-semibold transition ${
                activePage === "Settings"
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/[0.065] hover:text-white"
              }`}
            >
              <Settings
                size={19}
                strokeWidth={1.8}
                className="text-slate-400"
              />
              Settings
            </button>
          </div>
        </div>

        {/* Fixed account area */}
        <div className="mt-auto shrink-0 border-t border-white/[0.10] bg-[#0D2434] p-3.5 shadow-[0_-10px_24px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.045] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#55C2F4] to-[#167BAF] text-xs font-extrabold text-white shadow-md">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-white">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-[10px] font-medium capitalize text-slate-400">
                {admin?.role?.replace("_", " ") || "Administrator"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-rose-300/25 bg-rose-500/15 px-4 py-3 text-[13px] font-extrabold text-rose-100 transition duration-200 hover:border-rose-300/50 hover:bg-rose-500/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-300/50"
          >
            <LogOut size={17} strokeWidth={1.9} />
            <span>Sign out</span>
          </button>

          <p className="mt-3 text-center text-[9px] font-semibold tracking-[0.16em] text-slate-600">
            ZABWELFARE · ADMINISTRATION
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen min-w-0 lg:ml-[272px]">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:h-[78px] lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 lg:hidden"
            >
              <Menu size={20} strokeWidth={2} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="hidden text-xs font-medium text-slate-400 sm:inline">
                  Admin
                </span>

                <ChevronRight
                  size={13}
                  className="hidden text-slate-300 sm:block"
                />

                <h2 className="truncate text-[14px] font-bold text-slate-900 sm:text-[15px]">
                  {activePage}
                </h2>
              </div>

              <p className="mt-1 hidden text-[10px] font-medium text-slate-400 sm:block">
                ZABWelfare / Administration workspace
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <div className="hidden h-10 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 transition focus-within:border-sky-300 focus-within:bg-white md:flex">
              <Search size={16} className="text-slate-400" />

              <input
                type="search"
                placeholder="Search workspace..."
                className="w-36 bg-transparent text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400 lg:w-44"
              />

              <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-400">
                /
              </span>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              <Bell size={18} strokeWidth={1.8} />

              <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#E63946] ring-2 ring-white" />
            </button>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-xs font-extrabold text-sky-800 ring-1 ring-sky-100 sm:flex">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="mx-auto w-full max-w-[1600px] min-w-0 p-4 sm:p-6 lg:p-8">
          {activePage === "Overview" ? (
            <DashboardOverview
              admin={admin}
              onNavigate={handleNavigation}
            />
          ) : activePage === "Drives" ? (
            <AdminDrives />
          ) : activePage === "Gallery" ? (
            <AdminGallery />
          ) : activePage === "Team" ? (
            <AdminTeam />
          ) : activePage === "News & Updates" ? (
            <AdminNews />
          ) : activePage === "Donations" ? (
            <AdminDonations />
          ) : activePage === "Volunteers" ? (
            <AdminVolunteers />
          ) : activePage === "Contact Messages" ? (
            <AdminContacts />
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Settings size={22} strokeWidth={1.8} />
              </div>

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                {activePage}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                This section is ready for development. We'll connect it to
                the backend and build its management features in the next
                steps.
              </p>

              <button
                type="button"
                onClick={() => setActivePage("Overview")}
                className="mt-6 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12577E]"
              >
                Back to overview
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
