export type AgentStatus = "Active" | "Idle" | "Error" | "Stopped" | "Paused";
export type Agent = {
  id: number;
  name: string;
  status: AgentStatus;
  calls: number;
  uptime: number;
};
export type CallRow = {
  id: number;
  client: string;
  type: string;
  duration: number;
  sentiment: string;
  status: string;
};
export type Insight = { id: number; level: string; msg: string };
export type InsightsPayload = {
  summary: string;
  alerts: Insight[];
  chart: {
    callsTrend: number[];
    sentiments: { positive: number; neutral: number; negative: number };
  };
  topIntents?: { name: string; count: number }[];
};
