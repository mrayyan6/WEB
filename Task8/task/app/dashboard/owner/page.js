"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FIELDS = [
  { key: "lead_id",         label: "Lead ID",         type: "text"   },
  { key: "date_created",    label: "Date Created",    type: "date"   },
  { key: "source",          label: "Source",          type: "text"   },
  { key: "property_type",   label: "Property Type",   type: "text"   },
  { key: "city",            label: "City",            type: "text"   },
  { key: "budget_min",      label: "Budget Min",      type: "number" },
  { key: "budget_max",      label: "Budget Max",      type: "number" },
  { key: "bedrooms",        label: "Bedrooms",        type: "number" },
  { key: "lead_status",     label: "Status",          type: "select",
    options: ["New","Contacted","Qualified","Closed","Lost"] },
  { key: "agent",           label: "Agent",           type: "text"   },
  { key: "conversion_flag", label: "Converted",       type: "select",
    options: ["0","1"] },
  { key: "days_to_convert", label: "Days to Convert", type: "number" },
];

const EMPTY = Object.fromEntries(FIELDS.map((f) => [f.key, ""]));

export default function OwnerDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    setLoading(true);
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  }

  function openAdd() {
    setForm(EMPTY);
    setEditId(null);
    setError("");
    setShowModal(true);
  }

  function openEdit(lead) {
    const f = {};
    FIELDS.forEach(({ key, type }) => {
      if (type === "date" && lead[key]) {
        f[key] = new Date(lead[key]).toISOString().split("T")[0];
      } else {
        f[key] = lead[key] ?? "";
      }
    });
    setForm(f);
    setEditId(lead._id);
    setError("");
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    fetchLeads();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url    = editId ? `/api/leads/${editId}` : "/api/leads";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        budget_min:      Number(form.budget_min)      || 0,
        budget_max:      Number(form.budget_max)      || 0,
        bedrooms:        Number(form.bedrooms)        || 0,
        conversion_flag: Number(form.conversion_flag) || 0,
        days_to_convert: form.days_to_convert !== "" ? Number(form.days_to_convert) : null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Failed to save");
      return;
    }
    setShowModal(false);
    fetchLeads();
  }

  function fmt(key, val) {
    if (val == null || val === "") return "—";
    if (key === "date_created") return new Date(val).toLocaleDateString();
    if (key === "conversion_flag") return val === 1 ? "Yes" : "No";
    return String(val);
  }

  const COLS = FIELDS.map((f) => f.key);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", minHeight: "100vh", background: "#f9fafb", color: "#111" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Owner Dashboard</h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>
            {leads.length} leads total
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openAdd} style={btnPrimary}>+ Add Lead</button>
          <button onClick={handleLogout} style={btnLogout}>Logout</button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "#6b7280" }}>Loading...</p>
      ) : (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,.1)" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1e40af", color: "#fff" }}>
                {FIELDS.map((f) => (
                  <th key={f.key} style={thStyle}>{f.label}</th>
                ))}
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead._id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                  {COLS.map((key) => (
                    <td key={key} style={tdStyle}>{fmt(key, lead[key])}</td>
                  ))}
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <button onClick={() => openEdit(lead)} style={btnEdit}>Edit</button>
                    <button onClick={() => handleDelete(lead._id)} style={btnDelete}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>{editId ? "Edit Lead" : "Add Lead"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxHeight: "60vh", overflowY: "auto", paddingRight: 4 }}>
                {FIELDS.map(({ key, label, type, options }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 12, color: "#374151", marginBottom: 4 }}>{label}</label>
                    {type === "select" ? (
                      <select
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">Select...</option>
                        {options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={type}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        style={inputStyle}
                      />
                    )}
                  </div>
                ))}
              </div>
              {error && <p style={{ color: "#dc2626", margin: "12px 0 0", fontSize: 13 }}>{error}</p>}
              <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancel}>Cancel</button>
                <button type="submit" disabled={saving} style={btnPrimary}>
                  {saving ? "Saving..." : editId ? "Update" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: "10px 12px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" };
const tdStyle = { padding: "8px 12px", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap", color: "#111" };
const inputStyle = { width: "100%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13, boxSizing: "border-box" };
const btnPrimary = { padding: "8px 16px", background: "#1e40af", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 };
const btnEdit   = { padding: "4px 10px", background: "#0284c7", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, marginRight: 4 };
const btnDelete = { padding: "4px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 };
const btnCancel = { padding: "8px 16px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 };
const btnLogout = { padding: "8px 16px", background: "#6b7280", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 };
const overlay   = { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 };
const modal     = { background: "#fff", borderRadius: 10, padding: 24, width: "min(700px, 95vw)", boxShadow: "0 20px 60px rgba(0,0,0,.2)" };
