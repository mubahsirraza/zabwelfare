import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Mail, Search, RefreshCw, Eye, CheckCheck, Clock3, Trash2, X,
  CalendarDays, UserRound, AtSign, MessageSquareText, Inbox,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);

  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem("zabwelfareAdminToken")}` },
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/contact/admin/all`, authConfig);
      setContacts(response.data.contacts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const stats = useMemo(() => ({
    total: contacts.length,
    new: contacts.filter((item) => item.status === "New").length,
    read: contacts.filter((item) => item.status === "Read").length,
    resolved: contacts.filter((item) => item.status === "Resolved").length,
  }), [contacts]);

  const filtered = useMemo(() => contacts.filter((item) => {
    const matchesStatus = filter === "All" || item.status === filter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [item.name, item.email, item.subject, item.message]
      .filter(Boolean).some((value) => value.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  }), [contacts, filter, search]);

  const openMessage = async (item) => {
    setSelected(item);
    if (item.status === "New") {
      try {
        const response = await axios.patch(
          `${API_URL}/contact/admin/${item._id}/status`, { status: "Read" }, authConfig
        );
        const updated = response.data.contact || { ...item, status: "Read" };
        setSelected(updated);
        setContacts((current) => current.map((entry) => entry._id === item._id ? updated : entry));
      } catch (err) {
        setError(err.response?.data?.message || "Could not mark this message as read.");
      }
    }
  };

  const updateStatus = async (status) => {
    if (!selected) return;
    try {
      setProcessing(true);
      const response = await axios.patch(
        `${API_URL}/contact/admin/${selected._id}/status`, { status }, authConfig
      );
      const updated = response.data.contact || { ...selected, status };
      setSelected(updated);
      setContacts((current) => current.map((item) => item._id === selected._id ? updated : item));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update message status.");
    } finally {
      setProcessing(false);
    }
  };

  const deleteMessage = async (item) => {
    if (!window.confirm(`Delete the message from ${item.name}? This cannot be undone.`)) return;
    try {
      setProcessing(true);
      await axios.delete(`${API_URL}/contact/admin/${item._id}`, authConfig);
      setContacts((current) => current.filter((entry) => entry._id !== item._id));
      if (selected?._id === item._id) setSelected(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this message.");
    } finally {
      setProcessing(false);
    }
  };

  const dateLabel = (date) => date ? new Date(date).toLocaleString("en-PK", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
  }) : "—";

  const statusClass = (status) => ({
    New: "bg-sky-50 text-sky-700 ring-sky-100",
    Read: "bg-amber-50 text-amber-700 ring-amber-100",
    Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  }[status] || "bg-slate-100 text-slate-600 ring-slate-200");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
            <Mail size={13} /> Inbox management
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#18232D]">Contact Messages</h1>
          <p className="mt-1 text-sm text-[#64748B]">Read and manage enquiries submitted through your website.</p>
        </div>
        <button onClick={fetchContacts} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 disabled:opacity-60">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh inbox
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "All messages", value: stats.total, icon: Inbox, tone: "sky" },
          { label: "New", value: stats.new, icon: Mail, tone: "blue" },
          { label: "Read", value: stats.read, icon: Eye, tone: "amber" },
          { label: "Resolved", value: stats.resolved, icon: CheckCheck, tone: "emerald" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === "amber" ? "bg-amber-50 text-amber-700" : tone === "emerald" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}><Icon size={18} /></span>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{loading ? "—" : value}</p>
          </div>
        ))}
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or subject..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["All", "New", "Read", "Resolved"].map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${filter === status ? "bg-[#176B9A] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{status}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700"><Inbox size={25} /></div>
            <h3 className="mt-4 text-base font-bold text-slate-800">{contacts.length ? "No matching messages" : "Your inbox is empty"}</h3>
            <p className="mt-1 text-sm text-slate-500">{contacts.length ? "Try another search or status filter." : "New website enquiries will appear here."}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item._id} className="flex flex-col gap-3 p-4 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:px-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.status === "New" ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-500"}`}><Mail size={18} /></div>
                <button onClick={() => openMessage(item)} className="min-w-0 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-bold text-slate-900">{item.name}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusClass(item.status)}`}>{item.status}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-700">{item.subject}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{item.email} · {item.message}</p>
                </button>
                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <span className="text-[11px] text-slate-400">{dateLabel(item.createdAt)}</span>
                  <button onClick={() => openMessage(item)} aria-label="View message" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"><Eye size={16} /></button>
                  <button onClick={() => deleteMessage(item)} disabled={processing} aria-label="Delete message" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs font-medium text-slate-500">Showing {filtered.length} of {contacts.length} messages</div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="contact-message-title" className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-700">Incoming enquiry</p><h2 id="contact-message-title" className="mt-1 text-lg font-extrabold text-slate-900">Message details</h2></div>
              <button onClick={() => setSelected(null)} aria-label="Close details" className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"><X size={18} /></button>
            </div>
            <div className="space-y-5 p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusClass(selected.status)}`}>{selected.status}</span><span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><CalendarDays size={14} />{dateLabel(selected.createdAt)}</span></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sender</p><p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800"><UserRound size={15} className="text-sky-700" />{selected.name}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email address</p><a href={`mailto:${selected.email}`} className="mt-2 flex items-center gap-2 break-all text-sm font-bold text-sky-700 hover:underline"><AtSign size={15} />{selected.email}</a></div>
              </div>
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject</p><p className="mt-2 text-base font-bold text-slate-900">{selected.subject}</p></div>
              <div className="rounded-2xl border border-slate-200 p-4 sm:p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><MessageSquareText size={15} />Message</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{selected.message}</p></div>
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
                <button onClick={() => deleteMessage(selected)} disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"><Trash2 size={16} />Delete</button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {selected.status !== "Read" && <button onClick={() => updateStatus("Read")} disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-50 disabled:opacity-50"><Eye size={16} />Mark as read</button>}
                  {selected.status !== "Resolved" && <button onClick={() => updateStatus("Resolved")} disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"><CheckCheck size={16} />Mark resolved</button>}
                  {selected.status === "Resolved" && <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700"><CheckCheck size={16} />Resolved</span>}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
