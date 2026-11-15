
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  X,
  ExternalLink,
  Heart,
  Clock,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Verified: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
};

function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("zabwelfareAdminToken");

  const api = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    [token]
  );

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/donations/admin/all");

      setDonations(response.data.donations || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load donations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const filteredDonations = donations.filter((donation) => {
    const matchesFilter =
      filter === "All" || donation.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch = [
      donation.donorName,
      donation.email,
      donation.phone,
      donation.transactionReference,
      donation.paymentMethod,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: donations.length,
    pending: donations.filter((item) => item.status === "Pending").length,
    verified: donations.filter((item) => item.status === "Verified").length,
    rejected: donations.filter((item) => item.status === "Rejected").length,
    collected: donations
      .filter((item) => item.status === "Verified")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0),
  };

  const openDetails = (donation) => {
    setSelectedDonation(donation);
    setAdminNotes(donation.adminNotes || "");
  };

  const decideDonation = async (status) => {
    if (!selectedDonation) return;

    if (
      status === "Rejected" &&
      !adminNotes.trim()
    ) {
      alert("Please provide a reason before rejecting this donation.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to mark this donation as ${status.toLowerCase()}?`
      )
    ) {
      return;
    }

    try {
      setSaving(true);

      await api.patch(
        `/donations/admin/${selectedDonation._id}/decision`,
        {
          status,
          adminNotes: adminNotes.trim(),
        }
      );

      setSelectedDonation(null);
      await fetchDonations();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to update donation status."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteDonation = async (donation) => {
    if (
      !window.confirm(
        `Delete the donation record from ${donation.donorName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/donations/admin/${donation._id}`);

      setSelectedDonation(null);
      await fetchDonations();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to delete donation."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#18232D]">
            Donations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review contributions and manage payment verification.
          </p>
        </div>

        <button
          onClick={fetchDonations}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5EDF3] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            label: "Total Donations",
            value: stats.total,
            icon: Heart,
            color: "text-[#176B9A]",
            bg: "bg-[#EAF7FF]",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Verified",
            value: stats.verified,
            icon: BadgeCheck,
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
          {
            label: "Verified Amount",
            value: formatAmount(stats.collected),
            icon: CheckCircle,
            color: "text-[#176B9A]",
            bg: "bg-[#EAF7FF]",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#E5EDF3] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {stat.label}
                </span>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon size={18} className={stat.color} />
                </div>
              </div>

              <p className="mt-3 text-xl font-bold text-[#18232D]">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Donations table */}
      <div className="overflow-hidden rounded-xl border border-[#E5EDF3] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#E5EDF3] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-[#18232D]">
              Donation Records
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredDonations.length} records found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search donations..."
                className="w-full rounded-lg border border-[#E5EDF3] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#38A9E8] sm:w-64"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-[#E5EDF3] px-3 py-2.5 text-sm outline-none focus:border-[#38A9E8]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={17} />
            {error}
            <button
              onClick={fetchDonations}
              className="ml-auto font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading donations...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="py-16 text-center">
            <Heart size={32} className="mx-auto text-slate-300" />
            <p className="mt-3 font-medium text-slate-600">
              No donations found
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Donations will appear here when submitted.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#F8FAFC] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Donor</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Payment Method</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5EDF3]">
                {filteredDonations.map((donation) => (
                  <tr
                    key={donation._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#18232D]">
                        {donation.isAnonymous
                          ? "Anonymous Donor"
                          : donation.donorName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {donation.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#18232D]">
                      {formatAmount(donation.amount)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {donation.paymentMethod}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(donation.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[donation.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openDetails(donation)}
                          title="View donation"
                          className="rounded-lg border border-[#E5EDF3] p-2 text-slate-600 hover:bg-[#EAF7FF] hover:text-[#176B9A]"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => deleteDonation(donation)}
                          title="Delete donation"
                          className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
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

      {/* Donation details modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E5EDF3] p-5">
              <div>
                <h2 className="text-lg font-bold text-[#18232D]">
                  Donation Details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Submitted {formatDate(selectedDonation.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedDonation(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Donor", selectedDonation.isAnonymous ? "Anonymous Donor" : selectedDonation.donorName],
                  ["Email", selectedDonation.email || "Not provided"],
                  ["Phone", selectedDonation.phone],
                  ["Amount", formatAmount(selectedDonation.amount)],
                  ["Payment Method", selectedDonation.paymentMethod],
                  ["Transaction Reference", selectedDonation.transactionReference || "Not provided"],
                  ["Submission Date", formatDate(selectedDonation.createdAt)],
                  ["Current Status", selectedDonation.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-medium text-[#18232D]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {selectedDonation.message && (
                <div>
                  <p className="text-xs text-slate-500">Donor Message</p>
                  <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    {selectedDonation.message}
                  </p>
                </div>
              )}

              {selectedDonation.paymentProof?.url && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-500">
                    PAYMENT PROOF
                  </p>
                  <a
                    href={selectedDonation.paymentProof.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E5EDF3] px-3 py-2 text-sm font-medium text-[#176B9A] hover:bg-[#EAF7FF]"
                  >
                    View Uploaded Proof
                    <ExternalLink size={15} />
                  </a>
                </div>
              )}

              {selectedDonation.status === "Pending" ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#18232D]">
                      Admin Notes / Rejection Reason
                    </label>
                    <textarea
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add verification notes or a reason for rejection..."
                      className="w-full rounded-lg border border-[#E5EDF3] p-3 text-sm outline-none focus:border-[#38A9E8]"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      A reason is required when rejecting a donation.
                    </p>
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => decideDonation("Rejected")}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reject
                    </button>

                    <button
                      onClick={() => decideDonation("Verified")}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle size={17} />
                      {saving ? "Processing..." : "Verify Donation"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold">
                    This donation has already been {selectedDonation.status.toLowerCase()}.
                  </p>
                  {selectedDonation.adminNotes && (
                    <p className="mt-2">
                      Admin notes: {selectedDonation.adminNotes}
                    </p>
                  )}
                  {selectedDonation.verifiedAt && (
                    <p className="mt-2 text-xs text-slate-500">
                      Verified on {formatDate(selectedDonation.verifiedAt)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end border-t border-[#E5EDF3] pt-4">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDonations;
