
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Crown,
  Upload,
  X,
  Loader2,
  UserRound,
  CheckCircle2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyForm = {
  name: "",
  position: "Member",
  description: "",
  order: "0",
  isActive: true,
};

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const token = localStorage.getItem("zabwelfareAdminToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/team/admin/all`, {
          headers,
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load team members.");
        }

        setMembers(data.members || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load team members.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMembers();

    return () => controller.abort();
  }, [refresh]);

  const openCreateModal = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setPreview("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);

    setForm({
      name: member.name || "",
      position: member.position || "Member",
      description: member.description || "",
      order: String(member.order ?? 0),
      isActive: member.isActive,
    });

    setSelectedFile(null);
    setPreview(member.image?.url || "");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMember(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setPreview("");
    setError("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter the member's name.");
      return;
    }

    if (!editingMember && !selectedFile) {
      setError("Please upload a profile image.");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("position", form.position);
    formData.append("description", form.description);
    formData.append("order", form.order || "0");
    formData.append("isActive", String(form.isActive));

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      setSaving(true);
      setError("");

      const url = editingMember
        ? `${API_URL}/team/admin/${editingMember._id}`
        : `${API_URL}/team/admin`;

      const response = await fetch(url, {
        method: editingMember ? "PUT" : "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save team member.");
      }

      closeModal();
      setRefresh((value) => value + 1);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/team/admin/${member._id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete member.");
      }

      setRefresh((value) => value + 1);
    } catch (err) {
      window.alert(err.message || "Failed to delete member.");
    }
  };

  const filteredMembers = members.filter((member) => {
    const query = search.toLowerCase();

    return (
      member.name?.toLowerCase().includes(query) ||
      member.position?.toLowerCase().includes(query)
    );
  });

  const leaders = members.filter(
    (member) =>
      member.position === "President" ||
      member.position === "Vice President"
  ).length;

  const activeMembers = members.filter(
    (member) => member.isActive
  ).length;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">
            Manage your organization's people
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Team Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage the President, Vice President and team members.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12577E]"
        >
          <Plus size={18} />
          Add Team Member
        </button>
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Members"
          value={members.length}
          icon={Users}
        />
        <StatCard
          title="Leadership"
          value={leaders}
          icon={Crown}
        />
        <StatCard
          title="Active Members"
          value={activeMembers}
          icon={CheckCircle2}
        />
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search team members..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {error && !modalOpen && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={() => setRefresh((value) => value + 1)}
            className="ml-3 font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <Loader2 className="animate-spin text-sky-700" size={32} />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <Users size={40} className="mx-auto text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-800">
            {search ? "No matching members" : "No team members yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try another search."
              : "Add your first team member to get started."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <article
              key={member._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-64 bg-slate-100">
                {member.image?.url ? (
                  <img
                    src={member.image.url}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <UserRound size={55} className="text-slate-300" />
                  </div>
                )}

                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    member.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {member.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-sky-700">
                      {member.position}
                    </p>
                  </div>

                  {(member.position === "President" ||
                    member.position === "Vice President") && (
                    <Crown size={20} className="shrink-0 text-amber-500" />
                  )}
                </div>

                {member.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {member.description}
                  </p>
                )}

                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-800 hover:bg-sky-100"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(member)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter the member's information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter member name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Position *
                </label>
                <select
                  value={form.position}
                  onChange={(event) =>
                    setForm({ ...form, position: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
                >
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description / Introduction
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Short introduction (optional)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(event) =>
                    setForm({ ...form, order: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Lower numbers appear first within the same position group.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Profile Photo {!editingMember && "*"}
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 transition hover:border-sky-400">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="mb-3 h-36 w-36 rounded-xl object-cover"
                    />
                  ) : (
                    <Upload size={30} className="mb-2 text-slate-400" />
                  )}

                  <span className="text-sm font-semibold text-slate-700">
                    {selectedFile ? selectedFile.name : "Choose profile photo"}
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    JPG, PNG or WEBP · Maximum 5MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm({ ...form, isActive: event.target.checked })
                  }
                  className="h-4 w-4 accent-sky-700"
                />
                Display this member on the public website
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B9A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#12577E] disabled:opacity-60"
                >
                  {saving && <Loader2 size={17} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingMember
                      ? "Save Changes"
                      : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-xl bg-sky-50 p-2.5 text-sky-700">
          <Icon size={20} />
        </div>
      </div>
      <h3 className="mt-5 text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}
