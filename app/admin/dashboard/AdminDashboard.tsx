"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

interface Entry {
  id: number;
  publicKey: string;
  teamName: string;
  ipIncrement: number;
  createdAt: string;
}

interface EntryFormData {
  publicKey: string;
  teamName: string;
  ipIncrement: string;
}

const emptyForm: EntryFormData = { publicKey: "", teamName: "", ipIncrement: "" };

export default function AdminDashboard() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [formData, setFormData] = useState<EntryFormData>(emptyForm);
  const [formError, setFormError] = useState("");
  const [nextIpValue, setNextIpValue] = useState("");
  const [ipMsg, setIpMsg] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/admin/entries");
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    if (data.entries) setEntries(data.entries);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const openAdd = () => {
    setFormData(emptyForm);
    setFormError("");
    setShowAddModal(true);
  };

  const openEdit = (entry: Entry) => {
    setFormData({
      publicKey: entry.publicKey,
      teamName: entry.teamName,
      ipIncrement: String(entry.ipIncrement),
    });
    setFormError("");
    setEditEntry(entry);
  };

  const handleSave = async () => {
    setFormError("");
    const isEdit = editEntry !== null;
    const url = isEdit ? `/api/admin/entries/${editEntry.id}` : "/api/admin/entries";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicKey: formData.publicKey,
        teamName: formData.teamName,
        ipIncrement: formData.ipIncrement,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setShowAddModal(false);
      setEditEntry(null);
      fetchEntries();
    } else {
      setFormError(data.error || "Save failed. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/entries/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setDeleteId(null);
      fetchEntries();
    }
  };

  const handleSetIncrement = async () => {
    const val = parseInt(nextIpValue);
    if (isNaN(val) || val < 1) { setIpMsg("Enter a valid number."); return; }

    const res = await fetch("/api/admin/set-increment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextIncrement: val }),
    });
    const data = await res.json();
    setIpMsg(data.success ? `Next IP set to 10.0.0.${val}/32` : "Failed to set.");
    setNextIpValue("");
  };

  const handleClearIncrement = async () => {
    const res = await fetch("/api/admin/set-increment", { method: "DELETE" });
    const data = await res.json();
    setIpMsg(data.success ? "Override cleared. Using auto-increment." : "Failed to clear.");
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };
  const springTransition = { type: "spring" as const, stiffness: 280, damping: 22 };

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Admin Dashboard</h1>
        <motion.button
          onClick={handleLogout}
          className="py-2 px-4 bg-[var(--color3)] text-[var(--foreground)] rounded-xl hover:cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </div>

      {/* Set Next IP */}
      <div
        className="bg-[var(--color5)] text-[var(--background)] rounded-2xl p-4 mb-6"
        style={{ boxShadow: "var(--background) 0px 2px 8px" }}
      >
        <h2 className="text-lg font-semibold mb-3">Set Next IP Increment</h2>
        <div className="flex flex-wrap items-center gap-3">
          <motion.input
            initial={{ background: "#E1E1E1" }}
            whileHover={{ background: "#BDBDBD" }}
            className="border-2 rounded-xl p-2 text-base w-36"
            type="number"
            placeholder="e.g. 35"
            value={nextIpValue}
            onChange={(e) => setNextIpValue(e.target.value)}
          />
          <motion.button
            onClick={handleSetIncrement}
            className="py-2 px-4 bg-[var(--color3)] text-[var(--foreground)] rounded-xl hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Set
          </motion.button>
          <motion.button
            onClick={handleClearIncrement}
            className="py-2 px-4 bg-[var(--color4)] text-[var(--background)] rounded-xl hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Use Auto
          </motion.button>
          {ipMsg && <span className="text-sm font-medium">{ipMsg}</span>}
        </div>
        <p className="text-xs mt-2 opacity-60">
          &ldquo;Set&rdquo; overrides the next assigned IP. &ldquo;Use Auto&rdquo; clears the override and resumes auto-increment from the highest existing value.
        </p>
      </div>

      {/* Entries table */}
      <div
        className="bg-[var(--color5)] text-[var(--background)] rounded-2xl p-4"
        style={{ boxShadow: "var(--background) 0px 2px 8px" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Entries ({entries.length})</h2>
          <motion.button
            onClick={openAdd}
            className="py-2 px-4 bg-[var(--color3)] text-[var(--foreground)] rounded-xl hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Entry
          </motion.button>
        </div>

        {loading ? (
          <p className="text-center py-8 opacity-50">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-center py-8 opacity-50">No entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--color4)]">
                  <th className="text-left py-2 px-3 font-semibold">Team Name</th>
                  <th className="text-left py-2 px-3 font-semibold">Public Key</th>
                  <th className="text-left py-2 px-3 font-semibold">IP Address</th>
                  <th className="text-left py-2 px-3 font-semibold">Submitted</th>
                  <th className="text-left py-2 px-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[var(--color4)]/40 hover:bg-black/5"
                  >
                    <td className="py-2 px-3">{entry.teamName || <span className="opacity-40">—</span>}</td>
                    <td className="py-2 px-3 font-mono">
                      <span title={entry.publicKey}>
                        {entry.publicKey.length > 20
                          ? entry.publicKey.slice(0, 20) + "…"
                          : entry.publicKey}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono">10.0.0.{entry.ipIncrement}/32</td>
                    <td className="py-2 px-3 opacity-60">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => openEdit(entry)}
                          className="py-1 px-3 bg-[var(--color3)] text-[var(--foreground)] rounded-lg text-xs hover:cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => setDeleteId(entry.id)}
                          className="py-1 px-3 bg-red-500 text-white rounded-lg text-xs hover:cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editEntry !== null) && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
              className="bg-[var(--color5)] text-[var(--background)] rounded-2xl p-6 max-w-lg w-full mx-4"
              style={{ boxShadow: "var(--background) 0px 2px 12px" }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={springTransition}
            >
              <h2 className="text-xl font-bold mb-4">
                {editEntry ? "Edit Entry" : "Add Entry"}
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Public Key</label>
                  <motion.input
                    initial={{ background: "#E1E1E1" }}
                    whileHover={{ background: "#BDBDBD" }}
                    className="border-2 rounded-xl p-2 text-sm font-mono"
                    type="text"
                    placeholder="fg7E9hFLhTs1cy4B1QUL+u38b4qQ20ow3pH2MuKhgis="
                    value={formData.publicKey}
                    onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Team Name</label>
                  <motion.input
                    initial={{ background: "#E1E1E1" }}
                    whileHover={{ background: "#BDBDBD" }}
                    className="border-2 rounded-xl p-2 text-sm"
                    type="text"
                    placeholder="UCF Base Architecture"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">IP Increment (last octet)</label>
                  <motion.input
                    initial={{ background: "#E1E1E1" }}
                    whileHover={{ background: "#BDBDBD" }}
                    className="border-2 rounded-xl p-2 text-sm"
                    type="number"
                    placeholder="27"
                    value={formData.ipIncrement}
                    onChange={(e) => setFormData({ ...formData, ipIncrement: e.target.value })}
                  />
                  {formData.ipIncrement && (
                    <p className="text-xs opacity-60 ml-1">
                      → 10.0.0.{formData.ipIncrement}/32
                    </p>
                  )}
                </div>
                {formError && <p className="text-red-600 text-sm">{formError}</p>}
              </div>
              <div className="flex gap-3 justify-end mt-5">
                <motion.button
                  onClick={() => { setShowAddModal(false); setEditEntry(null); }}
                  className="py-2 px-4 bg-[var(--color4)] text-[var(--background)] rounded-xl hover:cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  className="py-2 px-4 bg-[var(--color3)] text-[var(--foreground)] rounded-xl hover:cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
              className="bg-[var(--color5)] text-[var(--background)] rounded-2xl p-6 max-w-sm w-full mx-4"
              style={{ boxShadow: "var(--background) 0px 2px 12px" }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={springTransition}
            >
              <h2 className="text-xl font-bold mb-3">Delete Entry</h2>
              <p className="mb-5 opacity-70">
                Are you sure you want to delete this entry? This cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <motion.button
                  onClick={() => setDeleteId(null)}
                  className="py-2 px-4 bg-[var(--color4)] text-[var(--background)] rounded-xl hover:cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(deleteId)}
                  className="py-2 px-4 bg-red-500 text-white rounded-xl hover:cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
