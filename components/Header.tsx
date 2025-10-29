'use client'
export default function AppHeader({onLogout}:{onLogout:()=>void}){
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">AI Sales Support Admin</h1>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-600">Role: <b>Admin</b></span>
        <button onClick={onLogout} className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300">Logout</button>
      </div>
    </div>
  )
}
