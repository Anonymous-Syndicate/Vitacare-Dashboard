import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, Bell, Search, LayoutDashboard, ShieldCheck, ArrowUpRight, ChevronLeft, Phone, Mail, MapPin, Calendar, Pill, Clock, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MEDICALLY DETAILED DATASET ---
const PATIENTS = [
  { 
    id: 'VP-101', 
    name: "Suresh Iyengar", 
    age: 62, 
    gender: "Male", 
    condition: "Type 2 Diabetes", 
    risk: "High", 
    adherence: 42, 
    location: "Bangalore", 
    phone: "+91 98450 12345", 
    email: "suresh.i@gmail.com", 
    lastVisit: "May 01, 2024", 
    medications: [
      { name: "Metformin Hydrochloride", dose: "500mg", route: "Oral", frequency: "2x Daily", timing: "Post-meal (Breakfast/Dinner)", status: "Active" },
      { name: "Gliclazide", dose: "80mg", route: "Oral", frequency: "1x Daily", timing: "30 mins before Breakfast", status: "Active" },
      { name: "Atorvastatin", dose: "10mg", route: "Oral", frequency: "1x Daily", timing: "Bedtime", status: "Active" }
    ], 
    lastTest: { type: "HbA1c / Lipid Profile", date: "Apr 15, 2024", result: "8.4%", status: "Critical" }, 
    vitals: { bp: "145/92 mmHg", sugar: "180 mg/dL", weight: "78.2 kg", heartRate: "82 bpm" } 
  },
  { 
    id: 'VP-102', 
    name: "Anjali Deshmukh", 
    age: 55, 
    gender: "Female", 
    condition: "Hypertension", 
    risk: "Low", 
    adherence: 95, 
    location: "Mumbai", 
    phone: "+91 91234 56789", 
    email: "anjali.d@outlook.com", 
    lastVisit: "Apr 28, 2024", 
    medications: [
      { name: "Amlodipine", dose: "5mg", route: "Oral", frequency: "1x Daily", timing: "Morning (Empty stomach)", status: "Active" },
      { name: "Telmisartan", dose: "40mg", route: "Oral", frequency: "1x Daily", timing: "Night", status: "Active" }
    ], 
    lastTest: { type: "Kidney Function Test", date: "Apr 10, 2024", result: "Creatinine 0.8", status: "Normal" }, 
    vitals: { bp: "118/76 mmHg", sugar: "105 mg/dL", weight: "62.0 kg", heartRate: "72 bpm" } 
  },
  { 
    id: 'VP-103', 
    name: "Vikram Malhotra", 
    age: 68, 
    gender: "Male", 
    condition: "COPD / Chronic Bronchitis", 
    risk: "Medium", 
    adherence: 78, 
    location: "Delhi", 
    phone: "+91 88001 99000", 
    email: "vikram.m@gmail.com", 
    lastVisit: "May 04, 2024", 
    medications: [
      { name: "Salbutamol (Ventolin)", dose: "100mcg", route: "Inhalation", frequency: "As needed", timing: "During shortness of breath", status: "Active" },
      { name: "Budesonide", dose: "400mcg", route: "Inhalation (DPI)", frequency: "2x Daily", timing: "Morning and Evening", status: "Active" }
    ], 
    lastTest: { type: "Spirometry", date: "Apr 20, 2024", result: "FEV1 65%", status: "Monitor" }, 
    vitals: { bp: "130/85 mmHg", sugar: "112 mg/dL", weight: "70.5 kg", heartRate: "88 bpm" } 
  }
];

// Add 20 more realistic placeholders for the demo list
for (let i = 4; i <= 30; i++) {
  PATIENTS.push({
    ...PATIENTS[1],
    id: `VP-1${i}`,
    name: i % 2 === 0 ? "Priya Verma" : "Rajesh Gupta",
    condition: i % 3 === 0 ? "Diabetes" : "Hypertension",
    risk: i % 5 === 0 ? "High" : "Low",
    adherence: 50 + (i * 2) % 45,
  });
}

const CHART_DATA = [
  { n: 'Mon', a: 65 }, { n: 'Tue', a: 70 }, { n: 'Wed', a: 68 }, { n: 'Thu', a: 85 }, { n: 'Fri', a: 90 }, { n: 'Sat', a: 92 }, { n: 'Sun', a: 94 }
];

// --- STYLED COMPONENTS ---

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/" },
    { icon: <Users size={20} />, label: "Patients", path: "/patients" },
  ];

  return (
    <aside className="w-64 bg-[#F5F5F7] border-r border-[#E5E5E5] p-8 flex flex-col fixed h-full select-none">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-[#007AFF] rounded-[10px] flex items-center justify-center shadow-sm">
          <ShieldCheck className="text-white" size={22} />
        </div>
        <h1 className="text-[20px] font-semibold tracking-tight text-[#1D1D1F]">VitalPath</h1>
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.path} className="no-underline">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200 ${location.pathname === item.path ? 'bg-white text-[#007AFF] shadow-sm font-medium' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}>
              {item.icon} <span className="text-[15px]">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

const PatientList = () => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => PATIENTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-semibold tracking-tight">Patients</h2>
        <div className="relative">
          <Search className="absolute left-4 top-3 text-[#86868B]" size={18} />
          <input 
            type="text" placeholder="Search patient database" 
            className="pl-11 pr-6 py-2.5 bg-[#E8E8ED] border-none rounded-full w-80 text-[15px] outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 transition-all"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#E5E5E5] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FBFBFD] border-b border-[#E5E5E5] text-[13px] font-medium text-[#86868B]">
            <tr>
              <th className="px-8 py-4">Identity</th>
              <th className="px-8 py-4">Clinical Condition</th>
              <th className="px-8 py-4">Risk Level</th>
              <th className="px-8 py-4">Visit History</th>
              <th className="px-8 py-4 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-[#F5F5F7]/50 transition-colors cursor-pointer group">
                <td className="px-8 py-5">
                  <p className="font-medium text-[#1D1D1F]">{p.name}</p>
                  <p className="text-[13px] text-[#86868B]">{p.id}</p>
                </td>
                <td className="px-8 py-5 text-[14px] text-[#424245]">{p.condition}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${p.risk === 'High' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-[#34C759]/10 text-[#34C759]'}`}>{p.risk}</span>
                </td>
                <td className="px-8 py-5 text-[14px] text-[#86868B]">{p.lastVisit}</td>
                <td className="px-8 py-5 text-right">
                  <Link to={`/patient/${p.id}`} className="text-[#007AFF] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={20} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = useMemo(() => PATIENTS.find(p => p.id === id), [id]);

  if (!patient) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl pb-20">
      <button onClick={() => navigate('/patients')} className="flex items-center gap-2 text-[#007AFF] font-medium text-[15px] mb-8 group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> All Patients
      </button>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Bio Card */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm">
            <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center text-[#86868B] text-2xl font-semibold mb-6">
              {patient.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">{patient.name}</h2>
            <p className="text-[15px] text-[#86868B] mb-8">{patient.id} • {patient.age}Y • {patient.gender}</p>
            
            <div className="space-y-4 text-[14px] text-[#424245]">
              <div className="flex items-center gap-3"><Phone size={16} className="text-[#86868B]" /> {patient.phone}</div>
              <div className="flex items-center gap-3"><Mail size={16} className="text-[#86868B]" /> {patient.email}</div>
              <div className="flex items-center gap-3"><MapPin size={16} className="text-[#86868B]" /> {patient.location}</div>
              <div className="flex items-center gap-3"><Calendar size={16} className="text-[#86868B]" /> Last Seen {patient.lastVisit}</div>
            </div>
          </div>

          <div className="bg-[#007AFF] p-8 rounded-[24px] text-white">
            <p className="text-[13px] font-medium opacity-70 mb-2 uppercase tracking-wide">Adherence Score</p>
            <div className="text-5xl font-semibold tracking-tighter mb-4">{patient.adherence}%</div>
            <div className="flex items-start gap-2 bg-white/10 p-4 rounded-[12px] text-[13px] leading-relaxed">
              <Info size={16} className="mt-0.5 shrink-0" />
              AI Insight: Increased probability of non-compliance detected. Schedule automated reminder for evening dose.
            </div>
          </div>
        </div>

        {/* Right Column: Medical Detail */}
        <div className="col-span-8 space-y-6">
          {/* Vitals Grid */}
          <div className="grid grid-cols-4 gap-4">
            <VitalBox label="Blood Pressure" val={patient.vitals.bp} status="Normal" />
            <VitalBox label="Blood Sugar" val={patient.vitals.sugar} status="Stable" />
            <VitalBox label="Heart Rate" val={patient.vitals.heartRate} status="Resting" />
            <VitalBox label="Weight" val={patient.vitals.weight} status="Stable" />
          </div>

          {/* Medications Section */}
          <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[19px] font-semibold tracking-tight">Prescribed Regimen</h3>
              <span className="text-[13px] text-[#86868B] bg-[#F5F5F7] px-3 py-1 rounded-full">{patient.medications.length} Active Meds</span>
            </div>
            <div className="space-y-4">
              {patient.medications.map((med, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-[#F5F5F7] rounded-[16px] group hover:bg-[#E8E8ED] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-sm">
                      <Pill size={18} className="text-[#007AFF]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[15px] text-[#1D1D1F]">{med.name} {med.dose}</p>
                      <p className="text-[13px] text-[#86868B]">{med.route} • {med.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#424245]">
                      <Clock size={14} className="text-[#86868B]" /> {med.timing}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Reports Section */}
          <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm">
             <h3 className="text-[19px] font-semibold tracking-tight mb-8">Recent Laboratory Observations</h3>
             <div className="flex items-center justify-between p-6 bg-[#1D1D1F] rounded-[20px] text-white shadow-lg">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold opacity-50 uppercase tracking-widest">Diagnostic Panel</p>
                  <p className="text-[17px] font-medium">{patient.lastTest.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold opacity-50 uppercase tracking-widest">Result</p>
                  <p className="text-[20px] font-semibold text-blue-400">{patient.lastTest.result}</p>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <div className={`w-2 h-2 rounded-full ${patient.lastTest.status === 'Normal' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-[12px] font-semibold tracking-wide uppercase">{patient.lastTest.status}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VitalBox = ({ label, val, status }) => (
  <div className="bg-white p-5 rounded-[20px] border border-[#E5E5E5] shadow-sm hover:border-blue-200 transition-colors">
    <p className="text-[12px] font-medium text-[#86868B] mb-1">{label}</p>
    <p className="text-[17px] font-semibold text-[#1D1D1F]">{val}</p>
    <p className="text-[11px] font-medium text-[#34C759] mt-2 flex items-center gap-1">
      <CheckCircle2 size={12} /> {status}
    </p>
  </div>
);

// --- APP WRAPPER ---

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#FBFBFD] text-[#1D1D1F] antialiased">
        <Sidebar />
        <main className="flex-1 ml-64 p-12">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patient/:id" element={<PatientProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const Overview = () => (
  <div className="max-w-6xl">
    <div className="flex justify-between items-end mb-10">
      <div>
        <h2 className="text-[15px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">Morning, Dr. Malhotra</h2>
        <h3 className="text-4xl font-semibold tracking-tight text-[#1D1D1F]">Health Overview</h3>
      </div>
      <div className="bg-white border border-[#E5E5E5] rounded-full px-5 py-2 flex items-center gap-3 shadow-sm">
        <div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse"></div>
        <span className="text-[14px] font-medium">Live System Status</span>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm">
        <p className="text-[13px] font-medium text-[#86868B] uppercase tracking-wide">Avg Adherence</p>
        <p className="text-4xl font-semibold mt-2 tracking-tight">88.4%</p>
      </div>
      <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm">
        <p className="text-[13px] font-medium text-[#86868B] uppercase tracking-wide">Critical Alerts</p>
        <p className="text-4xl font-semibold mt-2 tracking-tight text-[#FF3B30]">04</p>
      </div>
      <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm">
        <p className="text-[13px] font-medium text-[#86868B] uppercase tracking-wide">Active Care Plans</p>
        <p className="text-4xl font-semibold mt-2 tracking-tight">1,240</p>
      </div>
    </div>

    <div className="bg-white p-8 rounded-[32px] border border-[#E5E5E5] shadow-sm">
       <h3 className="text-[19px] font-semibold mb-8 tracking-tight">Network Adherence Performance</h3>
       <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="appleBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: '#86868B', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{stroke: '#E5E5E5', strokeWidth: 1}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}} />
                <Area type="monotone" dataKey="a" stroke="#007AFF" strokeWidth={3} fill="url(#appleBlue)" />
             </AreaChart>
          </ResponsiveContainer>
       </div>
    </div>
  </div>
);
