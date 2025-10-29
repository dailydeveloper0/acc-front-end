'use client'
export default function KPICard({ title, value, icon: Icon, color }:{ title:string; value:any; icon:any; color:string }){
  return (
    <div className={`bg-white rounded-xl shadow p-5 flex justify-between items-center border-t-4 ${color}`}>
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <Icon className="text-indigo-600"/>
    </div>
  )
}
