"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FIELDS = [
  { key: "lead_id",         label: "Lead ID"         },
  { key: "date_created",    label: "Date Created"    },
  { key: "source",          label: "Source"          },
  { key: "property_type",   label: "Property Type"   },
  { key: "city",            label: "City"            },
  { key: "budget_min",      label: "Budget Min"      },
  { key: "budget_max",      label: "Budget Max"      },
  { key: "bedrooms",        label: "Bedrooms"        },
  { key: "lead_status",     label: "Status"          },
  { key: "agent",           label: "Agent"           },
  { key: "conversion_flag", label: "Converted"       },
  { key: "days_to_convert", label: "Days to Convert" },
];

export default function EmployeeDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => { setLeads(data); setLoading(false); });
  }, []);

  function fmt(key, val) {
    if (val == null || val === "") return "—";
    if (key === "date_created") return new Date(val).toLocaleDateString();
    if (key === "conversion_flag") return val === 1 ? "Yes" : "No";
    return String(val);
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", minHeight: "100vh", background: "#f9fafb", color: "#111" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Employee Dashboard</h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>
            {loading ? "Loading..." : `${leads.length} leads — read only`}
          </p>
        </div>
        <button onClick={handleLogout} style={btnLogout}>Logout</button>
      </div>

      {!loading && (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,.1)" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#065f46", color: "#fff" }}>
                {FIELDS.map((f) => (
                  <th key={f.key} style={thStyle}>{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead._id} style={{ background: i % 2 === 0 ? "#fff" : "#f0fdf4" }}>
                  {FIELDS.map(({ key }) => (
                    <td key={key} style={tdStyle}>{fmt(key, lead[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: "10px 12px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" };
const tdStyle = { padding: "8px 12px", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap", color: "#111" };
const btnLogout = { padding: "8px 16px", background: "#6b7280", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 };
