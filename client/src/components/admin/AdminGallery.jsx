
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
  Star,
  Image as ImageIcon,
  Images,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "General",
  eventDate: "",
  featured: false,
};

const categories = [
  "General",
  "Education",
  "Food",
  "Healthcare",
  "Fundraising",
  "Environment",
  "Community Support",
  "Events",
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

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

function GalleryForm({ initialData, onClose, onSaved }) {
  const isEditing = Boolean(initialData?._id);

  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...(initialData || {}),
    eventDate: toDateInput(initialData?.eventDate),
  }));

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.image?.url || ""
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!getToken()) {
      setError("Your admin session has expired. Please log in again.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter an image title.");
      return;
    }

    if (!isEditing && !image) {
      setError("Please select an image to upload.");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("category", form.category);
      payload.append("eventDate", form.eventDate);
      payload.append("featured", String(form.featured));

      if (image) {
        payload.append("image", image);
      }

      if (isEditing) {
        await axios.put(
          `${API_URL}/gallery/admin/${initialData._id}`,
          payload,
          { headers: getHeaders() }
        );
      } else {
        await axios.post(
          `${API_URL}/gallery/admin`,
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
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Gallery Image" : "Upload Gallery Image"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add photos from your organization's activities and events.
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

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
          {error && (
            <div className="flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Image Title *
            </label>
            <input
              required
              maxLength={150}
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              placeholder="e.g. Community Blood Donation Camp"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              rows={3}
              maxLength={1000}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Write a short description of this photograph..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {form.description.length}/1000
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
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
                Event Date
              </label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(event) =>
                  updateField("eventDate", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Gallery Image {!isEditing && "*"}
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-7 text-center transition hover:border-sky-400 hover:bg-sky-50/50">
              {preview ? (
                <img
                  src={preview}
                  alt="Gallery preview"
                  className="mb-4 max-h-64 w-full rounded-xl object-contain"
                />
              ) : (
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <UploadCloud size={23} />
                </div>
              )}

              <span className="text-sm font-semibold text-slate-700">
                {image ? image.name : "Choose an image"}
              </span>
              <span className="mt-1 text-xs text-slate-400">
                JPG, PNG or WEBP · Maximum 5 MB
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
              className="h-4 w-4 accent-sky-600"
            />
            <span className="flex-1">
              <span className="block text-sm font-semibold text-slate-800">
                Feature this image
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Mark this image for prominent placement.
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
                  : "Upload Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGallery = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/gallery/admin/all`,
        { headers: getHeaders() }
      );

      const records =
        response.data.images ||
        response.data.data?.images ||
        response.data.data ||
        [];

      setImages(Array.isArray(records) ? records : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter((item) => {
      const searchable = [
        item.title,
        item.description,
        item.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [images, search, categoryFilter]);

  const openCreateForm = () => {
    setEditingImage(null);
    setFormOpen(true);
    setNotice("");
  };

  const openEditForm = (item) => {
    setEditingImage(item);
    setFormOpen(true);
    setNotice("");
  };

  const handleSaved = async () => {
    setFormOpen(false);
    setEditingImage(null);
    setNotice("Gallery image saved successfully.");
    await fetchGallery();
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(item._id);
    setError("");
    setNotice("");

    try {
      await axios.delete(
        `${API_URL}/gallery/admin/${item._id}`,
        { headers: getHeaders() }
      );

      setNotice("Gallery image deleted successfully.");
      await fetchGallery();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingId(null);
    }
  };

  const totalFeatured = images.filter(
    (item) => item.featured
  ).length;

  const uniqueCategories = [
    ...new Set(images.map((item) => item.category).filter(Boolean)),
  ];

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">
            Manage photographs from your welfare activities and events.
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Gallery Management
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12577E]"
        >
          <Plus size={18} />
          Upload New Image
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

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            label: "Total Images",
            value: images.length,
            icon: Images,
            color: "bg-sky-50 text-sky-700",
          },
          {
            label: "Featured Images",
            value: totalFeatured,
            icon: Star,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Categories",
            value: uniqueCategories.length,
            icon: ImageIcon,
            color: "bg-emerald-50 text-emerald-700",
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
            <h2 className="font-bold text-slate-900">All Gallery Images</h2>
            <p className="mt-1 text-xs text-slate-500">
              Upload, edit and organize your organization's photographs.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Search size={17} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search images..."
                className="w-full bg-transparent text-sm outline-none sm:w-44"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            >
              <option value="all">All categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchGallery}
              disabled={loading}
              title="Refresh gallery"
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
              Loading gallery...
            </p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <Images size={27} />
            </div>
            <h3 className="mt-4 font-bold text-slate-800">
              {images.length === 0
                ? "No gallery images yet"
                : "No matching images"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {images.length === 0
                ? "Upload your first photograph to start building your gallery."
                : "Try another search term or category."}
            </p>
            {images.length === 0 && (
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#12577E]"
              >
                <Plus size={17} />
                Upload First Image
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredImages.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
              >
                <div className="relative bg-slate-100">
                  {item.image?.url ? (
                    <img
                      src={item.image.url}
                      alt={item.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center text-slate-400">
                      <ImageIcon size={36} />
                    </div>
                  )}

                  {item.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-amber-600 shadow-sm">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      {item.category || "General"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays size={13} />
                      {formatDate(item.eventDate)}
                    </span>
                  </div>

                  <h3 className="mt-3 font-bold text-slate-900">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item._id}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === item._id ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredImages.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Showing {filteredImages.length} of {images.length} images
          </div>
        )}
      </section>

      {formOpen && (
        <GalleryForm
          initialData={editingImage}
          onClose={() => {
            setFormOpen(false);
            setEditingImage(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
