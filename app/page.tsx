"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import KPICard from "@/components/KPICard";
import AppHeader from "@/components/Header";
import {
  Phone,
  Users,
  Clock,
  CheckCircle2,
  Search,
  Download,
  TrendingUp,
} from "lucide-react";
import { downloadCSV } from "@/utils/csv";
import type { Agent, CallRow, InsightsPayload } from "@/types";

const base = process.env.REAL_BACKEND_BASE;

function NumberPill({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs">
      {label}: <b>{value}</b>
    </span>
  );
}

export default function Admin() {
  const [active, setActive] = useState("Dashboard");
  const [calls, setCalls] = useState<CallRow[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [insights, setInsights] = useState<InsightsPayload | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/calls"),
      fetch("/api/agents"),
      fetch("/api/insights"),
    ])
      .then(async ([c, a, i]) => [
        await c.json(),
        await a.json(),
        await i.json(),
      ])
      .then(([c, a, i]) => {
        setCalls(c);
        setAgents(a);
        setInsights(i);
      });
  }, []);

  // --- Pages inline for brevity ---
  function DashboardPage() {
    if (!insights)
      return <div className="bg-white p-4 rounded shadow">Loading…</div>;
    const total = insights.chart.callsTrend.reduce((s, n) => s + n, 0);
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Total Calls (7d)"
            value={total}
            icon={Phone}
            color="border-indigo-500"
          />
          <KPICard
            title="Agents Active"
            value={agents.filter((a) => a.status === "Active").length}
            icon={Users}
            color="border-green-500"
          />
          <KPICard
            title="Avg Duration"
            value={`${(
              calls.reduce((s, c) => s + Number(c.duration || 0), 0) /
              (calls.length || 1)
            ).toFixed(1)} min`}
            icon={Clock}
            color="border-blue-500"
          />
          <KPICard
            title="Completion Rate"
            value={`${(
              (calls.filter((c) => c.status === "Completed").length /
                (calls.length || 1)) *
              100
            ).toFixed(1)}%`}
            icon={CheckCircle2}
            color="border-orange-500"
          />
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Weekly Call Trend</h2>
            <NumberPill label="Goal" value="50 calls" />
          </div>
          <div className="flex gap-1 h-24 items-end">
            {insights.chart.callsTrend.map((v, i) => (
              <div key={i} className="bg-indigo-500/30 flex-1 relative">
                <div
                  className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded"
                  style={{
                    height: `${
                      (v / Math.max(...insights.chart.callsTrend)) * 100
                    }%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function LiveCallsPage() {
    const [q, setQ] = useState("");
    const [status, setStatus] = useState<
      "All" | "Active" | "Completed" | "Missed"
    >("All");
    const [page, setPage] = useState(1);
    const perPage = 8;
    const filtered = calls.filter(
      (c) =>
        (status === "All" || c.status === status) &&
        `${c.client} ${c.type} ${c.sentiment}`
          .toLowerCase()
          .includes(q.toLowerCase())
    );
    const paged = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [totalPages]);
    const exportCSV = () =>
      downloadCSV("calls.csv", [
        "Client,Type,Duration,Sentiment,Status",
        ...filtered.map(
          (c) =>
            `${c.client},${c.type},${c.duration},${c.sentiment},${c.status}`
        ),
      ]);
    return (
      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <h2 className="font-semibold">Live Calls</h2>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5" size={14} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter..."
                className="pl-7 pr-2 py-1.5 text-sm border rounded"
              />
            </div>
            <select
              className="text-sm border rounded px-2 py-1"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              {["All", "Active", "Completed", "Missed"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1 text-sm text-indigo-600"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-slate-500 border-b text-left">
            <tr>
              <th>Client</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Sentiment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} className="border-b hover:bg-slate-50">
                <td className="py-2">{c.client}</td>
                <td>{c.type}</td>
                <td>{Number(c.duration).toFixed(1)} min</td>
                <td>{c.sentiment}</td>
                <td>{c.status}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-500">
                  No calls match the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end items-center gap-2 mt-1 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 border rounded"
          >
            Prev
          </button>
          <span>
            {page}/{totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  function AgentsPage() {
    const [q, setQ] = useState("");
    const [newName, setNewName] = useState("");
    const filtered = useMemo(
      () =>
        agents.filter((a) =>
          `${a.name} ${a.status}`.toLowerCase().includes(q.toLowerCase())
        ),
      [agents, q]
    );
    async function action(
      id: number,
      act: "start" | "stop" | "restart" | "config"
    ) {
      try {
        const r = await fetch(`http://localhost:3003/api/v1/agents/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: act }),
        });
        if (!r.ok) throw new Error("backend error");
        const jsonData = await r.json();
        const status = jsonData.data.agent.status;

        setAgents((prev) => {
          return prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: status
                }
              : a
          );
        });
      } catch (e) {
        console.log(e);
      }
      if (act === "config") return; // config UI could be added
    }
    async function add() {
      console.log(newName)
      if (!newName.trim()) return;
      try {
        const r = await fetch("http://localhost:3003/api/v1/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        });

        if (!r.ok) throw new Error("backend error");
        const jsonData = await r.json();
        const agent = jsonData.data.agent
        setAgents((prev)=>[...prev, agent])
        setNewName("")
      } catch(e) {
        console.log(e);
      }
      // const id = Math.max(0, ...agents.map((a) => a.id)) + 1;
      // setAgents((prev) => [
      //   ...prev,
      //   { id, name: newName, status: "Idle", calls: 0, uptime: 100 },
      // ]);
      // setNewName("");
    }
    return (
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <h2 className="font-semibold">Agents</h2>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-2.5" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search agents..."
                className="pl-7 pr-2 py-1.5 text-sm border rounded"
              />
            </div>
            <div className="flex gap-1">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New agent name"
                className="text-sm border rounded px-2 py-1"
              />
              
              <button
                onClick={add}
                className="text-sm bg-emerald-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-left border-b">
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Calls</th>
              <th>Uptime</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b hover:bg-slate-50">
                <td className="py-2 font-medium">{a.name}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      a.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : a.status === "Idle"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td>{a.calls}</td>
                <td>{a.uptime}%</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => action(a.id, "start")}
                      className="px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => action(a.id, "stop")}
                      className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-700"
                    >
                      Stop
                    </button>
                    <button
                      onClick={() => action(a.id, "restart")}
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700"
                    >
                      Restart
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  No agents match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function InsightsPage() {
    if (!insights)
      return <div className="bg-white p-4 rounded shadow">Loading…</div>;
    const [lvl, setLvl] = useState<"All" | "High" | "Medium" | "Low">("All");
    const [q, setQ] = useState("");
    const filtered = insights.alerts.filter(
      (a) =>
        (lvl === "All" || a.level === lvl) &&
        `${a.level} ${a.msg}`.toLowerCase().includes(q.toLowerCase())
    );
    const exportCSV = () =>
      downloadCSV("insights.csv", [
        "Level,Message",
        ...filtered.map((a) => `${a.level},${a.msg}`),
      ]);
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <h2 className="font-semibold">Insights & Alerts</h2>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search size={14} className="absolute left-2 top-2.5" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search alerts..."
                  className="pl-7 pr-2 py-1.5 text-sm border rounded"
                />
              </div>
              <select
                className="text-sm border rounded px-2 py-1"
                value={lvl}
                onChange={(e) => setLvl(e.target.value as any)}
              >
                {["All", "High", "Medium", "Low"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1 text-sm text-indigo-600"
              >
                <Download size={14} />
                Export
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-700">{insights.summary}</p>
          <ul className="text-sm space-y-1">
            {filtered.map((a) => (
              <li
                key={a.id}
                className={`${
                  a.level === "High"
                    ? "bg-rose-100"
                    : a.level === "Medium"
                    ? "bg-amber-100"
                    : "bg-blue-50"
                } px-2 py-1 rounded`}
              >
                <strong>{a.level}:</strong> {a.msg}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-slate-500">No alerts match your filters.</li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  function AnalyticsPage() {
    const [range, setRange] = useState<"7d" | "14d" | "30d">("7d");
    const total = calls.length;
    const avg = (
      calls.reduce((s, c) => s + Number(c.duration || 0), 0) / (total || 1)
    ).toFixed(1);
    const comp = (
      (calls.filter((c) => c.status === "Completed").length / (total || 1)) *
      100
    ).toFixed(1);
    const base = [12, 18, 22, 25, 28, 30, 32];
    const trend =
      range === "14d"
        ? [...base, ...base.map((n) => Math.round(n * 0.9))]
        : range === "30d"
        ? [
            ...base,
            ...base.map((n) => Math.round(n * 0.85)),
            ...base.map((n) => Math.round(n * 0.8)),
          ]
        : base;
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 items-center justify-between">
          <h2 className="font-semibold">Analytics</h2>
          <div className="flex gap-2 items-center">
            <select
              className="text-sm border rounded px-2 py-1"
              value={range}
              onChange={(e) => setRange(e.target.value as any)}
            >
              {["7d", "14d", "30d"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-1">
            <div className="flex gap-2 text-xs text-slate-600">
              <NumberPill label="Avg Duration" value={`${avg} min`} />
              <NumberPill label="Completion" value={`${comp}%`} />
              <NumberPill label="# Calls" value={total} />
            </div>
            <TrendingUp size={18} className="text-indigo-600" />
          </div>
          <div className="flex gap-1 h-24 items-end">
            {trend.map((v, i) => (
              <div key={i} className="bg-indigo-500/30 flex-1 relative">
                <div
                  className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded"
                  style={{ height: `${(v / Math.max(...trend)) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function onLogout() {
    document.cookie = "role=; Max-Age=0; path=/";
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex relative">
      <Sidebar active={active} onNav={setActive} />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <AppHeader onLogout={onLogout} />
        {active === "Dashboard" && <DashboardPage />}
        {active === "Live Calls" && <LiveCallsPage />}
        {active === "Agents" && <AgentsPage />}
        {active === "Insights" && <InsightsPage />}
        {active === "Analytics" && <AnalyticsPage />}
      </main>
    </div>
  );
}
