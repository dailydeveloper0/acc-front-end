'use client'
import { Activity, Phone, Settings, Smile, BarChart3, ChevronRight, Bell } from 'lucide-react'

export default function Sidebar({active, onNav}: {active:string; onNav:(v:string)=>void}){
  const items = [
    { icon: Activity, label: 'Dashboard' },
    { icon: Phone, label: 'Live Calls' },
    { icon: Settings, label: 'Agents' },
    { icon: Smile, label: 'Insights' },
    { icon: BarChart3, label: 'Analytics' },
  ]
  return (
    <aside className="hidden lg:flex flex-col h-screen w-60 bg-white shadow p-5">
      <h1 className="text-lg font-bold mb-6 text-indigo-700 flex items-center justify-between">ACC Admin <Bell size={18}/></h1>
      {items.map(({icon:Icon,label}) => (
        <button key={label} onClick={()=>onNav(label)} className={`flex items-center gap-3 w-full px-3 py-2 rounded ${active===label?'bg-indigo-100 text-indigo-700 font-semibold':'hover:bg-indigo-50'}`}>
          <Icon size={18}/> {label}<ChevronRight className="ml-auto" size={14}/>
        </button>
      ))}
    </aside>
  )
}
