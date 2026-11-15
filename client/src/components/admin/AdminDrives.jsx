
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  UploadCloud,
  CalendarDays,
  MapPin,
  Star,
  Image as ImageIcon,
  HeartHandshake,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EMPTY_FORM = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: "Community Support",
  location: "",
  driveDate: "",
  status: "draft",
  featured: false,
};

const categories = [
  "Education",
  "Food",
  "Healthcare",
  "Fundraising",
  "Environment",
  "Community Support",
  "Other",
];

const getToken = () => localStorage.getItem("zabwelfareAdminToken");

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

const formatDate = (value) => {
  if (!value) return "Date not set";

  return new Date(value).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const toDateInput = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function StatusBadge({ status }) {
  const styles = {
    published: "bg-emerald-50 text-emerald-700",
    draft: "bg-amber-50 text-amber-700",
    completed: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || styles.draft
      }`}
    >
      {status || "draft"}
    </span>
  );
}

function DriveForm({
  initialData,
  onClose,
  onSaved,
}) {
  const isEditing = Boolean(initialData?._id);

  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...(initialData || {}),
    driveDate: toDateInput(initialData?.driveDate),
  }));

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.coverImage?.url || ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleTitleChange = (value) => {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug: previous.slug || makeSlug(value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!getToken()) {
      setError("Your admin session has expired. Please log in again.");
      return;
    }

    if (!form.title.trim() || !form.shortDescription.trim()) {
      setError("Please complete the required fields.");
      return;
    }

    if (!form.driveDate) {
      setError("Please select the drive date.");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append("title", form.title.trim());
      payload.append("slug", form.slug.trim() || makeSlug(form.title));
      payload.append("shortDescription", form.shortDescription.trim());
      payload.append("description", form.description.trim());
      payload.append("category", form.category);
      payload.append("location", form.location.trim());
      payload.append("driveDate", form.driveDate);
      payload.append("status", form.status);
      payload.append("featured", String(form.featured));

      if (image) {
        payload.append("coverImage", image);
      }

      if (isEditing) {
        await axios.put(
          `${API_URL}/drives/admin/${initialData._id}`,
          payload,
          { headers: getHeaders() }
        );
      } else {
        await axios.post(
          `${API_URL}/drives/admin`,
          payload,
          { headers: getHeaders() }
        );
      }

      onSaved();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6">
      <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Drive" : "Create New Drive"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add the details of your welfare activity.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
          {error && (
            <div className="flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Drive Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="e.g. Winter Relief Drive"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                URL Slug *
              </label>
              <input
                required
                value={form.slug}
                onChange={(event) => updateField("slug", makeSlug(event.target.value))}
                placeholder="winter-relief-drive"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
              <p className="mt-1 text-xs text-slate-400">
                Used in the public drive page URL.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Short Description *
              </label>
              <textarea
                required
                rows={2}
                maxLength={300}
                value={form.shortDescription}
                onChange={(event) =>
                  updateField("shortDescription", event.target.value)
                }
                placeholder="A brief summary of this drive..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {form.shortDescription.length}/300
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Description *
              </label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Write the complete details of this welfare drive..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Drive Date *
              </label>
              <input
                required
                type="date"
                value={form.driveDate}
                onChange={(event) => updateField("driveDate", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Hyderabad, Sindh"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Publication Status
              </label>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Cover Image
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-7 text-center transition hover:border-sky-400 hover:bg-sky-50/50">
              {preview ? (
                <img
                  src={preview}
                  alt="Drive cover preview"
                  className="mb-4 h-44 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <UploadCloud size={23} />
                </div>
              )}

              <span className="text-sm font-semibold text-slate-700">
                {image ? image.name : "Choose a cover image"}
              </span>
              <span className="mt-1 text-xs text-slate-400">
                JPG, PNG or WEBP · Maximum 5 MB
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];
                  if (selectedFile) setImage(selectedFile);
                }}
              />
            </label>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(event) => updateField("featured", event.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
            <span className="flex-1">
              <span className="block text-sm font-semibold text-slate-800">
                Feature this drive
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Mark this drive as featured for prominent placement.
              </span>
            </span>
            <Star size={19} className="text-amber-500" />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B9A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12577E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <RefreshCw size={16} className="animate-spin" />
              )}
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Drive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDrives = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/drives/admin/all`,
        { headers: getHeaders() }
      );

      const records =
        response.data.drives ||
        response.data.data?.drives ||
        response.data.data ||
        [];

      setDrives(Array.isArray(records) ? records : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const matchesSearch = [
        drive.title,
        drive.category,
        drive.location,
        drive.shortDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || drive.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drives, search, statusFilter]);

  const openCreateForm = () => {
    setEditingDrive(null);
    setFormOpen(true);
    setNotice("");
  };

  const openEditForm = (drive) => {
    setEditingDrive(drive);
    setFormOpen(true);
    setNotice("");
  };

  const handleSaved = async () => {
    setFormOpen(false);
    setEditingDrive(null);
    setNotice("Drive saved successfully.");
    await fetchDrives();
  };

  const handleDelete = async (drive) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${drive.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(drive._id);
    setError("");
    setNotice("");

    try {
      await axios.delete(
        `${API_URL}/drives/admin/${drive._id}`,
        { headers: getHeaders() }
      );

      setNotice("Drive deleted successfully.");
      await fetchDrives();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingId(null);
    }
  };

  const totalPublished = drives.filter(
    (drive) => drive.status === "published"
  ).length;

  const totalDrafts = drives.filter(
    (drive) => drive.status === "draft"
  ).length;

  const totalFeatured = drives.filter(
    (drive) => drive.featured
  ).length;

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">
            Manage your organization's welfare activities.
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Drives Management
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12577E]"
        >
          <Plus size={18} />
          Create New Drive
        </button>
      </div>

      {notice && (
        <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Drives",
            value: drives.length,
            icon: HeartHandshake,
            color: "bg-sky-50 text-sky-700",
          },
          {
            label: "Published",
            value: totalPublished,
            icon: ImageIcon,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Drafts",
            value: totalDrafts,
            icon: CalendarDays,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Featured",
            value: totalFeatured,
            icon: Star,
            color: "bg-orange-50 text-orange-700",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>
                <div className={`rounded-xl p-2.5 ${item.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">All Drives</h2>
            <p className="mt-1 text-xs text-slate-500">
              View and manage your welfare drives.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Search size={17} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search drives..."
                className="w-full bg-transparent text-sm outline-none sm:w-44"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
            </select>

            <button
              type="button"
              onClick={fetchDrives}
              disabled={loading}
              title="Refresh drives"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center">
            <RefreshCw size={26} className="animate-spin text-sky-600" />
            <p className="mt-3 text-sm text-slate-500">
              Loading drives...
            </p>
          </div>
        ) : filteredDrives.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <HeartHandshake size={27} />
            </div>
            <h3 className="mt-4 font-bold text-slate-800">
              {drives.length === 0
                ? "No drives created yet"
                : "No matching drives"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {drives.length === 0
                ? "Create your first welfare drive to start managing activities."
                : "Try another search term or change the status filter."}
            </p>
            {drives.length === 0 && (
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#12577E]"
              >
                <Plus size={17} />
                Create a Drive
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Drive</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredDrives.map((drive) => (
                    <tr key={drive._id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex min-w-64 items-center gap-3">
                          {drive.coverImage?.url ? (
                            <img
                              src={drive.coverImage.url}
                              alt={drive.title}
                              className="h-14 w-16 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-16 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                              <ImageIcon size={21} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="max-w-64 truncate text-sm font-semibold text-slate-800">
                              {drive.title}
                            </p>
                            <p className="mt-1 max-w-64 truncate text-xs text-slate-400">
                              {drive.shortDescription}
                            </p>
                            {drive.featured && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                                <Star size={11} fill="currentColor" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {drive.category}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={15} className="text-slate-400" />
                          {formatDate(drive.driveDate)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={drive.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(drive)}
                            title="Edit drive"
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(drive)}
                            disabled={deletingId === drive._id}
                            title="Delete drive"
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            {deletingId === drive._id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {filteredDrives.map((drive) => (
                <article
                  key={drive._id}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  {drive.coverImage?.url && (
                    <img
                      src={drive.coverImage.url}
                      alt={drive.title}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <StatusBadge status={drive.status} />
                      {drive.featured && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star size={13} fill="currentColor" />
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-bold text-slate-900">
                      {drive.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {drive.shortDescription}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{drive.category}</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={13} />
                        {formatDate(drive.driveDate)}
                      </span>
                      {drive.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} />
                          {drive.location}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => openEditForm(drive)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-700"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(drive)}
                        disabled={deletingId === drive._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {!loading && filteredDrives.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Showing {filteredDrives.length} of {drives.length} drives
          </div>
        )}
      </section>

      {formOpen && (
        <DriveForm
          initialData={editingDrive}
          onClose={() => {
            setFormOpen(false);
            setEditingDrive(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
