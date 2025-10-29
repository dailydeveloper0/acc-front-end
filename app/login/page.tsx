'use client'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [nextPath, setNextPath] = useState('/')
  useEffect(()=>{
    const sp = new URLSearchParams(window.location.search)
    setNextPath(sp.get('next') || '/')
  },[])

  function setRole(role: 'admin'|'viewer') {
    document.cookie = `role=${role}; path=/; max-age=${60*60*24*7}`
    window.location.href = nextPath
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-2">ACC Admin Login</h1>
        <p className="text-sm text-slate-600 mb-4">Choose a role to continue. This is a demo role gate — replace with real auth.</p>
        <div className="flex gap-2">
          <button onClick={()=>setRole('admin')} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded">Login as Admin</button>
          <button onClick={()=>setRole('viewer')} className="flex-1 border px-4 py-2 rounded">Viewer</button>
        </div>
      </div>
    </div>
  )
}
