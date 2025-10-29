// import { Agent, CallRecord, Insight, } from "@/types";

// const BASE = typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_BASE ? process.env.NEXT_PUBLIC_API_BASE : "";

// async function safeFetch<T>(url: string, fallback: T): Promise<T> {
//   try {
//     if (!BASE) throw new Error("BASE not configured");
//     const res = await fetch(`${BASE}${url}`, { cache: "no-store" });
//     if (!res.ok) throw new Error("bad response");
//     return (await res.json()) as T;
//   } catch (e) {
//     console.warn("API fetch failed:", e);
//     return fallback;
//   }
// }

// export async function fetchAgents(): Promise<Agent[]> {
//   const fallback: Agent[] = [
//     { id: "a-1", name: "Fyn the Fox", status: "Active", calls: 8, uptime: 99.1, config: { promptVersion: "v2.4", language: "en", retryPolicy: 2, escalation: "human" } },
//     { id: "a-2", name: "Luna", status: "Idle", calls: 0, uptime: 97.5 },
//     { id: "a-3", name: "Aiden", status: "Error", calls: 0, uptime: 92.2 }
//   ];
//   return safeFetch<Agent[]>("/agents", fallback);
// }

// export async function fetchCalls(): Promise<CallRecord[]> {
//   const fallback: CallRecord[] = [
//     { id: "c-1", client: "Alice Morgan", type: "Lead", duration: 12, sentiment: "Positive", status: "Completed", transcriptPreview: "Discussed mortgage timeline...", agentId: "a-1" },
//     { id: "c-2", client: "Robert Johnson", type: "Debt Mgmt", duration: 6, sentiment: "Neutral", status: "Active", transcriptPreview: "Asked about late payments...", agentId: "a-1" },
//     { id: "c-3", client: "Sarah Kim", type: "Mortgage", duration: 3, sentiment: "Negative", status: "Missed", transcriptPreview: "Missed connect", agentId: "a-2" }
//   ];
//   return safeFetch<CallRecord[]>("/calls", fallback);
// }

// export async function fetchInsights(): Promise<Insights> {
//   const fallback: Insights = {
//     summary: "Fyn handled ~45 calls today. Top intent: Credit Improvement.",
//     alerts: [{ id: "i-1", level: "High", msg: "Agent Aiden unreachable" }, { id: "i-2", level: "Medium", msg: "Speech latency spike on Luna" }],
//     chart: { callsTrend: [12, 15, 18, 22, 20, 24, 30], sentiments: { positive: 58, neutral: 30, negative: 12 } }
//   };
//   return safeFetch<Insights>("/insights", fallback);
// }

// export async function postAgentConfig(agentId: string, body: Partial<Agent>): Promise<{ ok: boolean }> {
//   try {
//     if (!BASE) throw new Error("BASE not configured");
//     const res = await fetch(`${BASE}/agents/${agentId}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
//     return res.ok ? { ok: true } : { ok: false };
//   } catch (e) {
//     console.warn("postAgentConfig error", e);
//     return { ok: false };
//   }
// }
