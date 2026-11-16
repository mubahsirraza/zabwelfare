
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  X,
  Mail,
  Phone,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const token = localStorage.getItem("zabwelfareAdminToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/volunteers/admin/all`,
        authConfig
      );

      setVolunteers(response.data.volunteers || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load volunteer applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const stats = useMemo(
    () => ({
      total: volunteers.length,
      pending: volunteers.filter((v) => v.status === "Pending").length,
      approved: volunteers.filter((v) => v.status === "Approved").length,
      rejected: volunteers.filter((v) => v.status === "Rejected").length,
    }),
    [volunteers]
  );

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      const matchesFilter =
        filter === "All" || volunteer.status === filter;

      const searchText = search.toLowerCase();

      const matchesSearch = [
        volunteer.fullName,
        volunteer.email,
        volunteer.phone,
        volunteer.areaOfInterest,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchText));

      return matchesFilter && matchesSearch;
    });
  }, [volunteers, filter, search]);

  const openDetails = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setAdminNotes(volunteer.adminNotes || "");
  };

  const handleDecision = async (status) => {
    if (!selectedVolunteer) return;

    if (status === "Rejected" && !adminNotes.trim()) {
      alert("Please provide a reason for rejecting this application.");
      return;
    }

    try {
      setProcessing(true);

      await axios.patch(
        `${API_URL}/volunteers/admin/${selectedVolunteer._id}/decision`,
        {
          status,
          adminNotes,
        },
        authConfig
      );

      setSelectedVolunteer(null);
      setAdminNotes("");
      await fetchVolunteers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to update this application."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (volunteer) => {
    const confirmed = window.confirm(
      `Delete the volunteer application from ${volunteer.fullName}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setProcessing(true);

      await axios.delete(
        `${API_URL}/volunteers/admin/${volunteer._id}`,
        authConfig
      );

      if (selectedVolunteer?._id === volunteer._id) {
        setSelectedVolunteer(null);
      }

      await fetchVolunteers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to delete this application."
      );
    } finally {
      setProcessing(false);
    }
  };

  const statusStyle = (status) => {
    if (status === "Approved") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18232D]">
            Volunteer Applications
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Review and manage people who want to join ZABWelfare.
          </p>
        </div>

        <button
          onClick={fetchVolunteers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5EDF3] bg-white px-4 py-2.5 text-sm font-semibold text-[#18232D] hover:bg-[#F8FAFC] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            label: "Total Applications",
            value: stats.total,
            icon: Users,
            color: "text-[#176B9A]",
            bg: "bg-[#EAF7FF]",
          },
          {
            label: "Pending Review",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Approved",
            value: stats.approved,
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#E5EDF3] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748B]">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-[#18232D]">
                    {stat.value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <Icon size={21} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5EDF3] bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or interest..."
            className="w-full rounded-xl border border-[#E5EDF3] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#38A9E8]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-[#E5EDF3] bg-white px-4 py-3 text-sm outline-none focus:border-[#38A9E8]"
        >
          <option value="All">All Applications</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Application Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E5EDF3] bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-[#64748B]">
            <RefreshCw size={18} className="animate-spin" />
            Loading applications...
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchVolunteers}
              className="mt-4 rounded-lg bg-[#176B9A] px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={35} className="mx-auto text-[#94A3B8]" />
            <p className="mt-3 font-semibold text-[#18232D]">
              No applications found
            </p>
            <p className="mt-1 text-sm text-[#64748B]">
              Applications will appear here when visitors submit the volunteer form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                <tr>
                  <th className="px-5 py-4">Applicant</th>
                  <th className="px-5 py-4">Area of Interest</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5EDF3]">
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer._id} className="hover:bg-[#FAFCFE]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#18232D]">
                        {volunteer.fullName}
                      </p>
                      <p className="mt-1 text-xs text-[#64748B]">
                        {volunteer.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#475569]">
                      {volunteer.areaOfInterest}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {formatDate(volunteer.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                          volunteer.status
                        )}`}
                      >
                        {volunteer.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openDetails(volunteer)}
                          title="View application"
                          className="rounded-lg border border-[#E5EDF3] p-2 text-[#176B9A] hover:bg-[#EAF7FF]"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(volunteer)}
                          disabled={processing}
                          title="Delete application"
                          className="rounded-lg border border-[#FECACA] p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedVolunteer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedVolunteer(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5EDF3] p-5">
              <div>
                <h2 className="text-lg font-bold text-[#18232D]">
                  Application Details
                </h2>
                <p className="mt-1 text-xs text-[#64748B]">
                  Submitted {formatDate(selectedVolunteer.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedVolunteer(null)}
                className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-[#18232D]">
                  {selectedVolunteer.fullName}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                    selectedVolunteer.status
                  )}`}
                >
                  {selectedVolunteer.status}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-[#176B9A]" />
                  <div>
                    <p className="text-xs text-[#64748B]">Email</p>
                    <p className="break-all text-sm font-medium text-[#18232D]">
                      {selectedVolunteer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-[#176B9A]" />
                  <div>
                    <p className="text-xs text-[#64748B]">Phone</p>
                    <p className="text-sm font-medium text-[#18232D]">
                      {selectedVolunteer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users size={18} className="mt-0.5 text-[#176B9A]" />
                  <div>
                    <p className="text-xs text-[#64748B]">Area of Interest</p>
                    <p className="text-sm font-medium text-[#18232D]">
                      {selectedVolunteer.areaOfInterest}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays size={18} className="mt-0.5 text-[#176B9A]" />
                  <div>
                    <p className="text-xs text-[#64748B]">Submitted</p>
                    <p className="text-sm font-medium text-[#18232D]">
                      {formatDate(selectedVolunteer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare size={17} className="text-[#176B9A]" />
                  <p className="text-sm font-semibold text-[#18232D]">
                    Motivation / Message
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] p-4 text-sm leading-7 text-[#475569]">
                  {selectedVolunteer.motivation || "No message provided."}
                </div>
              </div>

              {selectedVolunteer.status === "Pending" ? (
                <div className="border-t border-[#E5EDF3] pt-5">
                  <label className="mb-2 block text-sm font-semibold text-[#18232D]">
                    Admin Notes
                    <span className="font-normal text-[#64748B]">
                      {" "} (required for rejection)
                    </span>
                  </label>

                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Write review notes or rejection reason..."
                    className="w-full rounded-xl border border-[#E5EDF3] p-3 text-sm outline-none focus:border-[#38A9E8]"
                  />

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => handleDecision("Approved")}
                      disabled={processing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle2 size={17} />
                      Approve Application
                    </button>

                    <button
                      onClick={() => handleDecision("Rejected")}
                      disabled={processing || !adminNotes.trim()}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reject Application
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase text-[#64748B]">
                    Admin Notes
                  </p>
                  <p className="mt-2 text-sm text-[#475569]">
                    {selectedVolunteer.adminNotes || "No admin notes."}
                  </p>
                  {selectedVolunteer.reviewedAt && (
                    <p className="mt-2 text-xs text-[#64748B]">
                      Reviewed {formatDate(selectedVolunteer.reviewedAt)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVolunteers;
