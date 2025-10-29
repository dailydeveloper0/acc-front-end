import { NextResponse } from 'next/server'

export async function GET() {
  const base = process.env.NEXT_BACKEND_URL;
  try {
    if (base) {
      const r = await fetch(`${base.replace(/\/$/, '')}/calls`, { cache: 'no-store' })
       if (!r.ok) throw new Error("backend error");
      const jsonData = await r.json()
      return NextResponse.json(jsonData.data.calls)
    }
  } catch {}
  // fallback mock
  return NextResponse.json([
    { id:1, client:'Alice Morgan', type:'Lead Inquiry', duration:5.2, sentiment:'Positive', status:'Completed' },
    { id:2, client:'Robert Johnson', type:'Debt Mgmt', duration:1.1, sentiment:'Neutral', status:'Active' },
    { id:3, client:'Sarah Kim', type:'Mortgage', duration:0.4, sentiment:'Negative', status:'Missed' },
  ])
}
