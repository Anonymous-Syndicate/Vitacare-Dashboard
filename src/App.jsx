import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Activity, Users, Bell, Search, LayoutDashboard, ShieldCheck, ArrowUpRight, Filter, ChevronLeft, Phone, Mail, MapPin, Calendar, Pill, Droplets, Thermometer, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- EXPANDED DATASET (30 Patients with Meds & Tests) ---
const PATIENTS = [
  { id: 'VP-101', name: "Suresh Iyengar", age: 62, gender: "Male", condition: "Type 2 Diabetes", risk: "High", adherence: 42, location: "Bangalore", phone: "+91 98450 12345", email: "suresh.i@gmail.com", lastVisit: "2024-05-01", 
    medications: ["Metformin 500mg (Post-breakfast)", "Gliclazide 80mg (Pre-dinner)"], 
    lastTest: { date: "2024-04-15", result: "HbA1c: 8.4%", status: "Abnormal" }, 
    vitals: { bp: "145/92", sugar: "180 mg/dL", weight: "78kg" } },
  
  { id: 'VP-102', name: "Anjali Deshmukh", age: 55, gender: "Female", condition: "Hypertension", risk: "Low", adherence: 95, location: "Mumbai", phone: "+91 91234 56789", email: "anjali.d@outlook.com", lastVisit: "2024-04-28", 
    medications: ["Amlodipine 5mg (Morning)", "Telmisartan 40mg (Night)"], 
    lastTest: { date: "2024-04-10", result: "Cholesterol: 190 mg/dL", status: "Normal" }, 
    vitals: { bp: "118/76", sugar: "105 mg/dL", weight: "62kg" } },

  { id: 'VP-103', name: "Vikram Malhotra", age: 68, gender: "Male", condition: "COPD", risk: "Medium", adherence: 78, location: "Delhi", phone: "+91 88001 99000", email: "vikram.m@gmail.com", lastVisit: "2024-05-04", 
    medications: ["Salbutamol Inhaler (As needed)", "Budesonide (Twice daily)"], 
    lastTest: { date: "2024-04-20", result: "SPO2: 94%", status: "Monitor" }, 
    vitals: { bp: "130/85", sugar: "110 mg/dL", weight: "70kg" } },

  { id: 'VP-104', name: "Priya Nair", age: 45, gender: "Female", condition: "Chronic Kidney Disease", risk: "High", adherence: 30, location: "Chennai", phone: "+91 77665 44332", email: "priya.nair@yahoo.com", lastVisit: "2024-04-15", 
    medications: ["Furosemide 40mg (Morning)", "Erythropoietin (Weekly)"], 
    lastTest: { date: "2024-05-01", result: "Creatinine: 2.1 mg/dL", status: "Critical" }, 
    vitals: { bp: "155/98", sugar: "115 mg/dL", weight: "58kg" } },

  { id: 'VP-105', name: "Rajesh Khanna", age: 70, gender: "Male", condition: "Hypertension", risk: "Medium", adherence: 65, location: "Pune", phone: "+91 99887 22110", email: "raj.k@gmail.com", lastVisit: "2024-05-02", 
    medications: ["Losartan 50mg", "Hydrochlorothiazide 12.5mg"], 
    lastTest: { date: "2024-04-05", result: "Uric Acid: 7.2 mg/dL", status: "Normal" }, 
    vitals: { bp: "138/88", sugar: "120 mg/dL", weight: "82kg" } },

  { id: 'VP-106', name: "Lakshmi Rao", age: 52, gender: "Female", condition: "Type 2 Diabetes", risk: "Low", adherence: 88, location: "Bangalore", phone: "+91 94480 11223", email: "lakshmi.r@gmail.com", lastVisit: "2024-05-03", 
    medications: ["Sitagliptin 100mg", "Voglibose 0.2mg"], 
    lastTest: { date: "2024-04-25", result: "HbA1c: 6.8%", status: "Normal" }, 
    vitals: { bp: "122/80", sugar: "135 mg/dL", weight: "65kg" } },

  { id: 'VP-107', name: "Arjun Mehta", age: 48, gender: "Male", condition: "Asthma", risk: "Medium", adherence: 72, location: "Ahmedabad", phone: "+91 98250 55667", email: "arjun.m@gmail.com", lastVisit: "2024-04-30", 
    medications: ["Montelukast 10mg", "Fluticasone Propionate"], 
    lastTest: { date: "2024-04-12", result: "FeNO Test: 22 ppb", status: "Normal" }, 
    vitals: { bp: "125/82", sugar: "98 mg/dL", weight: "74kg" } },

  { id: 'VP-108', name: "Kavita Singh", age: 59, gender: "Female", condition: "Hypertension", risk: "High", adherence: 55, location: "Lucknow", phone: "+91 88776 55443", email: "kavita.s@gmail.com", lastVisit: "2024-04-20", 
    medications: ["Ramipril 5mg", "Indapamide 1.5mg"], 
    lastTest: { date: "2024-05-02", result: "Potassium: 3.8 mEq/L", status: "Normal" }, 
    vitals: { bp: "152/95", sugar: "140 mg/dL", weight: "68kg" } },
];

// Generate 20 more dummy patients to make it 30 (Quick loop)
for(let i=9; i<=30; i++) {
  PATIENTS.push({
    id: `VP-1${i}`,
    name: `Patient Name ${i}`,
    age: 40 + (i % 30),
    gender: i % 2 === 0 ? "Female" : "Male",
    condition: i % 3 === 0 ? "Diabetes" : "Hypertension",
    risk: i % 4 === 0 ? "High" : "Low",
    adherence: 40 + (i * 2) % 60,
    location: "Mumbai",
    phone: `+91 90000 000${i}`,
    email: `patient${i}@test.com`,
    lastVisit: "2024-04-20",
    medications: ["Standard Med A", "Standard Med B"],
    lastTest: { date: "2024-04-10", result: "Normal", status: "Normal" },
    vitals: { bp: "120/80", sugar: "100 mg/dL", weight: "70kg" }
  });
}

const ADHERENCE_TREND = [
  { name: 'Mon', val: 65 }, { name: 'Tue', val: 78 }, { name: 'Wed', val: 72 }, 
  { name: 'Thu', val: 90 }, { name: 'Fri', val: 85 }, { name: 'Sat', val: 92 }, { name: 'Sun', val: 95 }
];

// --- COMPONENTS ---

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/" },
    { icon: <Users size={20} />, label: "Patients", path: "/patients" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col fixed h-full">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">VitalPath</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.path} style={{ textDecoration: 'none' }}>
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
              {item.icon} <span className="font-bold">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

// --- PAGES ---

const Dashboard = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Patients</p>
        <h4 className="text-4xl font-black mt-2">1,240</h4>
      </div>
      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Adherence Rate</p>
        <h4 className="text-4xl font-black mt-2 text-blue-600">88.4%</h4>
      </div>
      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Critical Risks</p>
        <h4 className="text-4xl font-black mt-2 text-red-500">08</h4>
      </div>
    </div>
    <div className="bg-white p-8 rounded-[32px] border border-gray-100">
      <h3 className="text-xl font-bold mb-6">Clinic-wide Adherence</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ADHERENCE_TREND}>
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip />
            <Area type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={4} fill="url(#colorBlue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

const PatientList = () => {
  const [search, setSearch] = useState("");
  const filtered = PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search 30+ patients..." 
            className="pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl w-96 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="px-8 py-4">Patient</th>
              <th className="px-8 py-4">Condition</th>
              <th className="px-8 py-4">Risk</th>
              <th className="px-8 py-4">Last Visit</th>
              <th className="px-8 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.id}</p>
                </td>
                <td className="px-8 py-5 text-sm font-semibold">{p.condition}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.risk === 'High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{p.risk}</span>
                </td>
                <td className="px-8 py-5 text-sm text-gray-500 font-medium">{p.lastVisit}</td>
                <td className="px-8 py-5">
                  <Link to={`/patient/${p.id}`} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    View Profile <ArrowRight size={16} />
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
  const patient = PATIENTS.find(p => p.id === id);

  if (!patient) return <div className="p-10">Patient not found.</div>;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      {/* Header */}
      <button onClick={() => navigate('/patients')} className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-6 hover:text-slate-800 transition-colors">
        <ChevronLeft size={20} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 font-black text-2xl mb-4">
              {patient.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-black text-slate-900">{patient.name}</h2>
            <p className="text-gray-400 font-bold mb-6">{patient.id} • {patient.age}Y • {patient.gender}</p>
            
            <div className="space-y-4 pt-6 border-t border-gray-50">
               <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Phone size={18} className="text-gray-300" /> {patient.phone}
               </div>
               <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Mail size={18} className="text-gray-300" /> {patient.email}
               </div>
               <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <MapPin size={18} className="text-gray-300" /> {patient.location}
               </div>
               <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Calendar size={18} className="text-gray-300" /> Last visit: {patient.lastVisit}
               </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-100">
             <h4 className="text-xs font-black uppercase tracking-widest opacity-60 mb-4">AI Adherence Scoring</h4>
             <div className="text-5xl font-black mb-2">{patient.adherence}%</div>
             <p className="text-sm font-medium leading-relaxed opacity-90">
               Patient has missed 3 evening doses this week. High probability of blood pressure spike in the next 48 hours.
             </p>
          </div>
        </div>

        {/* Right Column: Medical Data */}
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <VitalCard icon={<Thermometer />} label="Blood Pressure" val={patient.vitals.bp} color="text-red-500" />
            <VitalCard icon={<Droplets />} label="Blood Sugar" val={patient.vitals.sugar} color="text-orange-500" />
            <VitalCard icon={<Activity />} label="Current Weight" val={patient.vitals.weight} color="text-blue-500" />
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Pill className="text-blue-600" /> Prescribed Medications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {patient.medications.map((med, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">💊</div>
                   <p className="font-bold text-slate-700 text-sm">{med}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100">
            <h3 className="text-xl font-black mb-6">Last Laboratory Test Data</h3>
            <div className="flex justify-between items-center p-6 bg-slate-900 rounded-[24px] text-white">
              <div>
                <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Test Parameter</p>
                <p className="text-lg font-bold">{patient.lastTest.result}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Date</p>
                <p className="text-lg font-bold">{patient.lastTest.date}</p>
              </div>
              <div className={`px-4 py-1 rounded-full text-xs font-black uppercase ${patient.lastTest.status === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {patient.lastTest.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VitalCard = ({ icon, label, val, color }) => (
  <div className="bg-white p-6 rounded-[24px] border border-gray-50 shadow-sm">
    <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mb-3 ${color}`}>
      {icon}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-xl font-black text-slate-800 mt-1">{val}</p>
  </div>
);

// --- MAIN WRAPPER ---

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#FBFBFD] font-sans text-slate-900">
        <Sidebar />
        <main className="flex-1 ml-64 p-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patient/:id" element={<PatientProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
