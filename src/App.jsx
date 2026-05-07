import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, Bell, Search, LayoutDashboard, ShieldCheck, ArrowUpRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA (Merged here to prevent errors) ---
const INITIAL_PATIENTS = [
  { id: 'VP-101', name: "Suresh Iyengar", age: 62, condition: "Diabetes", risk: "High", adherence: 42, location: "Bangalore", trend: [40, 35, 45, 42], phone: "+91 98450 12345" },
  { id: 'VP-102', name: "Anjali Deshmukh", age: 55, condition: "Hypertension", risk: "Low", adherence: 95, location: "Mumbai", trend: [90, 92, 94, 95], phone: "+91 91234 56789" },
  { id: 'VP-103', name: "Vikram Malhotra", age: 68, condition: "COPD", risk: "Medium", adherence: 78, location: "Delhi", trend: [70, 75, 80, 78], phone: "+91 88001 99000" },
  { id: 'VP-104', name: "Priya Nair", age: 45, condition: "CKD", risk: "High", adherence: 30, location: "Chennai", trend: [50, 40, 35, 30], phone: "+91 77665 44332" },
  { id: 'VP-105', name: "Rajesh Khanna", age: 70, condition: "Hypertension", risk: "Medium", adherence: 65, location: "Pune", trend: [60, 62, 68, 65], phone: "+91 99887 22110" },
];

const CHART_DATA = [
  { name: 'Mon', adherence: 65, engagement: 40 },
  { name: 'Tue', adherence: 88, engagement: 55 },
  { name: 'Wed', adherence: 75, engagement: 70 },
  { name: 'Thu', adherence: 94, engagement: 85 },
  { name: 'Fri', adherence: 82, engagement: 75 },
  { name: 'Sat', adherence: 90, engagement: 92 },
  { name: 'Sun', adherence: 96, engagement: 98 },
];

// --- UI COMPONENTS ---

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/" },
    { icon: <Users size={20} />, label: "Patients", path: "/patients" },
    { icon: <Activity size={20} />, label: "Analytics", path: "/analytics" },
  ];

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6 flex flex-col fixed h-full z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">VitalPath</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.path} style={{ textDecoration: 'none' }}>
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-gray-500 hover:bg-gray-100'}`}>
              {item.icon} <span className="font-bold">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Live Prototype</p>
        <p className="text-xs text-blue-800 font-medium leading-tight">Patient monitoring active.</p>
      </div>
    </aside>
  );
};

const StatCard = ({ title, value, change, isCritical }) => (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-2 h-full ${isCritical ? 'bg-red-500' : 'bg-blue-600'}`}></div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{title}</p>
      <div className="flex items-baseline gap-3">
        <h4 className="text-4xl font-black tracking-tighter text-slate-900">{value}</h4>
        <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${isCritical ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{change}</span>
      </div>
    </div>
  );

const Dashboard = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Avg. Adherence" value="88.4%" change="+2.4%" />
      <StatCard title="Critical Alerts" value="04" change="-2" isCritical />
      <StatCard title="Active Care Plans" value="1,240" change="+12" />
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-8 text-slate-800">Patient Adherence Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorAdh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
              <Area type="monotone" dataKey="adherence" stroke="#2563EB" strokeWidth={4} fill="url(#colorAdh)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 text-slate-800">AI Risk Queue</h3>
        <div className="space-y-4">
          {INITIAL_PATIENTS.slice(0, 4).map(p => (
            <div key={p.id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-slate-800">{p.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">{p.condition}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.risk === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{p.risk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const Patients = () => {
  const [search, setSearch] = useState("");
  const filtered = INITIAL_PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl w-96 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2">
          <Filter size={18} /> Filter List
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-8 py-5">ID</th>
              <th className="px-8 py-5">Patient</th>
              <th className="px-8 py-5">Condition</th>
              <th className="px-8 py-5">Risk</th>
              <th className="px-8 py-5">Adherence</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                <td className="px-8 py-5 text-sm font-medium text-gray-400">{p.id}</td>
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-800">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.location}</p>
                </td>
                <td className="px-8 py-5 text-sm font-semibold text-slate-700">{p.condition}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.risk === 'High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {p.risk}
                  </span>
                </td>
                <td className="px-8 py-5">
                   <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${p.adherence}%` }}></div>
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <ArrowUpRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-900">
        <Sidebar />
        <main className="flex-1 ml-64 p-10">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Hospital Central</h2>
              <p className="text-gray-500 font-medium">Monitoring chronic care patients</p>
            </div>
            <div className="flex gap-4">
               <button className="p-3 bg-white border border-gray-200 rounded-2xl relative shadow-sm">
                  <Bell size={22} className="text-slate-600" />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg border-2 border-white"></div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/analytics" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
