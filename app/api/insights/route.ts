import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_BACKEND_URL;
  try {
    if (base) {
      const r = await fetch(`${base.replace(/\/$/, "")}/insights/latest`, {
        cache: "no-store",
      });
      if (!r.ok) throw new Error("backend error");
      const jsonData = await r.json();
      return NextResponse.json(jsonData.data.insight);
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(null);
  }
  // return NextResponse.json({
  //   summary:'This week: 45 total calls, 72% positive sentiment, top category: Credit Audit.',
  //   alerts:[{id:1, level:'High', msg:'Agent Aiden unreachable (connection lost)'},{id:2, level:'Medium', msg:'Speech latency spike detected on Luna'},{id:3, level:'Low', msg:'Two clients requested human escalation'}],
  //   chart:{ callsTrend:[12,18,22,25,28,30,32], sentiments:{positive:72, neutral:18, negative:10} },
  //   topIntents:[{name:'Credit Audit',count:18},{name:'Dispute',count:11},{name:'Mortgage',count:8}]
  // })
}
