
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Newspaper,
  Eye,
  Star,
  Upload,
  Image as ImageIcon,
  FileText,
  RefreshCw,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "General",
  status: "Draft",
  featured: false,
};

export default function AdminNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState("");

  const token = localStorage.getItem("zabwelfareAdminToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/news/admin/all`, {
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load news articles");
        }

        setArticles(data.news || []);
      } catch (err) {
        setError(err.message || "Unable to load news articles");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [refresh]);

  const publishedCount = articles.filter(
    (article) => article.status === "Published"
  ).length;

  const draftCount = articles.filter(
    (article) => article.status === "Draft"
  ).length;

  const featuredCount = articles.filter(
    (article) => article.featured
  ).length;

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(search.toLowerCase()) ||
      article.category?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || article.status === filter;

    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setForm(initialForm);
    setEditingArticle(null);
    setSelectedFile(null);
    setPreview("");
    setFormError("");
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (article) => {
    setEditingArticle(article);

    setForm({
      title: article.title || "",
      excerpt: article.excerpt || "",
      content: article.content || "",
      category: article.category || "General",
      status: article.status || "Draft",
      featured: Boolean(article.featured),
    });

    setSelectedFile(null);
    setPreview(article.coverImage?.url || "");
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size must be less than 5MB.");
      return;
    }

    setFormError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setFormError("Please complete the title, excerpt and article content.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("excerpt", form.excerpt.trim());
      formData.append("content", form.content.trim());
      formData.append("category", form.category);
      formData.append("status", form.status);
      formData.append("featured", String(form.featured));

      if (selectedFile) {
        formData.append("coverImage", selectedFile);
      }

      const url = editingArticle
        ? `${API_URL}/news/admin/${editingArticle._id}`
        : `${API_URL}/news/admin`;

      const response = await fetch(url, {
        method: editingArticle ? "PUT" : "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save news article");
      }

      setShowModal(false);
      resetForm();
      setRefresh((value) => value + 1);
    } catch (err) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (article) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${article.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(article._id);

      const response = await fetch(
        `${API_URL}/news/admin/${article._id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete article");
      }

      setArticles((previous) =>
        previous.filter((item) => item._id !== article._id)
      );
    } catch (err) {
      alert(err.message || "Unable to delete article");
    } finally {
      setDeletingId(null);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            News & Updates
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage announcements, stories and news articles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12577F]"
        >
          <Plus size={18} />
          Create Article
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Newspaper}
          label="Total Articles"
          value={articles.length}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Eye}
          label="Published"
          value={publishedCount}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={FileText}
          label="Drafts"
          value={draftCount}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={Star}
          label="Featured"
          value={featuredCount}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search news articles..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#176B9A]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Published", "Draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === status
                  ? "bg-[#176B9A] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}

          <button
            onClick={() => setRefresh((value) => value + 1)}
            className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
            title="Refresh articles"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            onClick={() => setRefresh((value) => value + 1)}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Articles */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center text-slate-500">
          Loading news articles...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
          <Newspaper size={42} className="mx-auto text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            {articles.length === 0
              ? "No news articles yet"
              : "No matching articles"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {articles.length === 0
              ? "Create your first news article to get started."
              : "Try changing your search or filter."}
          </p>

          {articles.length === 0 && (
            <button
              onClick={openCreateModal}
              className="mt-5 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white"
            >
              Create First Article
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-48 bg-slate-100">
                {article.coverImage?.url ? (
                  <img
                    src={article.coverImage.url}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <ImageIcon size={42} />
                  </div>
                )}

                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      article.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {article.status}
                  </span>

                  {article.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#176B9A]">
                    {article.category || "General"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                  {article.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                  {article.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    onClick={() => openEditModal(article)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#176B9A] hover:bg-blue-50"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(article)}
                    disabled={deletingId === article._id}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deletingId === article._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
          <div className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingArticle ? "Edit Article" : "Create News Article"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the article details below.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              {/* Cover image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cover Image
                </label>

                {preview ? (
                  <div className="relative h-52 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={preview}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview("");
                      }}
                      className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow"
                    >
                      <X size={17} />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-[#176B9A] hover:bg-blue-50">
                    <Upload size={27} className="text-slate-400" />
                    <span className="mt-3 text-sm font-semibold text-slate-600">
                      Click to upload cover image
                    </span>
                    <span className="mt-1 text-xs text-slate-400">
                      JPG, PNG or WebP · Maximum 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}

                {preview && (
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#176B9A]">
                    <Upload size={16} />
                    Change image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="Enter news title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#176B9A]"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Short Description / Excerpt *
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={form.excerpt}
                  onChange={(event) =>
                    setForm({ ...form, excerpt: event.target.value })
                  }
                  placeholder="Write a short summary of the article..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#176B9A]"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.excerpt.length}/500
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Article Content *
                </label>
                <textarea
                  required
                  rows={9}
                  value={form.content}
                  onChange={(event) =>
                    setForm({ ...form, content: event.target.value })
                  }
                  placeholder="Write the complete news article here..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#176B9A]"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Plain text content. You can use line breaks between paragraphs.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  maxLength={80}
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  placeholder="e.g. Events, Announcements, Welfare"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#176B9A]"
                />
              </div>

              {/* Status */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Publication Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#176B9A]"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      setForm({ ...form, featured: event.target.checked })
                    }
                    className="h-4 w-4 accent-[#176B9A]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-700">
                      Featured Article
                    </span>
                    <span className="text-xs text-slate-400">
                      Highlight this article on the website.
                    </span>
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#176B9A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12577F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingArticle
                      ? "Update Article"
                      : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
