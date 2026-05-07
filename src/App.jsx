import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, Bell, Search, LayoutDashboard, ShieldCheck, ArrowUpRight, ChevronLeft, Phone, Mail, MapPin, Calendar, Pill, Clock, Info, CheckCircle2, FileText, X, Download, Printer } from 'lucide-react';
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
    vitals: { bp: "145/92 mmHg", sugar: "180 mg/dL", weight: "78.2 kg", heartRate: "82 bpm" },
    report: {
      labName: "Apollo Diagnostics - MG Road",
      reference: "REF-992011",
      parameters: [
        { name: "Hemoglobin", result: "13.2", unit: "g/dL", range: "13.5 - 17.5", status: "Low" },
        { name: "WBC Count", result: "7,400", unit: "cells/mcL", range: "4,500 - 11,000", status: "Normal" },
        { name: "Platelet Count", result: "2,10,000", unit: "cells/mcL", range: "1,50,000 - 4,50,000", status: "Normal" },
        { name: "HbA1c (Glycated Hemoglobin)", result: "8.4", unit: "%", range: "4.0 - 5.6", status: "Critical" },
        { name: "Fast Blood Sugar", result: "168", unit: "mg/dL", range: "70 - 100", status: "High" },
        { name: "Creatinine", result: "1.1", unit: "mg/dL", range: "0.7 - 1.3", status: "Normal" },
        { name: "ALT (SGPT)", result: "42", unit: "U/L", range: "7 - 56", status: "Normal" },
      ]
    }
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
    vitals: { bp: "118/76 mmHg", sugar: "105 mg/dL", weight: "62.0 kg", heartRate: "72 bpm" },
    report: {
      labName: "Metropolis Healthcare - Bandra",
      reference: "REF-884122",
      parameters: [
        { name: "Hemoglobin", result: "14.1", unit: "g/dL", range: "12.0 - 15.5", status: "Normal" },
        { name: "Creatinine", result: "0.8", unit: "mg/dL", range: "0.6 - 1.1", status: "Normal" },
        { name: "Total Cholesterol", result: "185", unit: "mg/dL", range: "< 200", status: "Normal" },
        { name: "LDL Cholesterol", result: "110", unit: "mg/dL", range: "< 130", status: "Normal" }
      ]
    }
  }
];

// Fill out rest of the 30 patients for the demo
for (let i = 3; i <= 30; i++) {
  PATIENTS.push({
    ...PATIENTS[1], id: `VP-1${i}`, name: i % 2 === 0 ? "Priya Verma" : "Rajesh Gupta",
    condition: i % 3 === 0 ? "Diabetes" : "Hypertension",
    risk: i % 5 === 0 ? "High" : "Low", adherence: 50 + (i * 2) % 45,
  });
}

const CHART_DATA = [
  { n: 'Mon', a: 65 }, { n: 'Tue', a: 70 }, { n: 'Wed', a: 68 }, { n: 'Thu', a: 85 }, { n: 'Fri', a: 90 }, { n: 'Sat', a: 92 }, { n: 'Sun', a: 94 }
];

// --- MODAL COMPONENT ---

const LabReportModal = ({ isOpen, onClose, patient }) => {
  if (!isOpen || !patient || !patient.report) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1D1D1F]/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[28px] shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-8 border-b border-[#F5F5F7] flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Clinical Diagnostic Report</h3>
            <p className="text-[#86868B] text-[14px] mt-1">{patient.report.labName} • {patient.report.reference}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-[#F5F5F7] rounded-full text-[#86868B] hover:text-[#1D1D1F] transition-colors"><X size={20} /></button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FBFBFD] p-4 rounded-xl border border-[#F5F5F7]">
               <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Patient Name</p>
               <p className="font-semibold text-[#1D1D1F] mt-1">{patient.name}</p>
            </div>
            <div className="bg-[#FBFBFD] p-4 rounded-xl border border-[#F5F5F7]">
               <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Report Date</p>
               <p className="font-semibold text-[#1D1D1F] mt-1">{patient.lastTest.date}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[13px] font-bold text-[#86868B] uppercase tracking-widest px-1">Biomarker Analysis</h4>
            <div className="bg-white border border-[#E5E5E5] rounded-[20px] overflow-hidden">
               <table className="w-full text-left text-[14px]">
                 <thead className="bg-[#FBFBFD] border-b border-[#E5E5E5] text-[#86868B]">
                   <tr>
                     <th className="px-6 py-3 font-medium">Test Parameter</th>
                     <th className="px-6 py-3 font-medium text-center">Result</th>
                     <th className="px-6 py-3 font-medium text-right">Reference Range</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#F5F5F7]">
                   {patient.report.parameters.map((p, i) => (
                     <tr key={i}>
                       <td className="px-6 py-4 font-medium text-[#1D1D1F]">{p.name}</td>
                       <td className="px-6 py-4 text-center">
                         <span className={`font-bold ${p.status === 'Normal' ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>{p.result}</span>
                         <span className="text-[12px] text-[#86868B] ml-1">{p.unit}</span>
                       </td>
                       <td className="px-6 py-4 text-right text-[#86868B] font-mono text-[13px]">{p.range}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>

          <div className="bg-[#F5F5F7] p-6 rounded-[20px]">
             <h5 className="flex items-center gap-2 text-[14px] font-semibold mb-2"><Info size={16} /> Clinical Pathologist Note</h5>
             <p className="text-[13px] text-[#424245] leading-relaxed">Values for HbA1c and Blood Sugar indicate poor glycemic control over the last 90 days. Recommended immediate review of insulin dosage and lifestyle compliance.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#F5F5F7] border-t border-[#E5E5E5] flex justify-end gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E5E5] rounded-full text-[14px] font-medium hover:bg-gray-50 transition-colors"><Printer size={16} /> Print</button>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1D1D1F] text-white rounded-full text-[14px] font-medium hover:opacity-90 transition-opacity"><Download size={16} /> Download PDF</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- PAGES ---

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
  const [showReport, setShowReport] = useState(false);
  const patient = useMemo(() => PATIENTS.find(p => p.id === id), [id]);

  if (!patient) return null;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl pb-20">
        <button onClick={() => navigate('/patients')} className="flex items-center gap-2 text-[#007AFF] font-medium text-[15px] mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> All Patients
        </button>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column Bio remains same */}
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
                AI Insight: Patient metrics show deviation. Recommend immediate intervention.
              </div>
            </div>
          </div>

          <div className="col-span-8 space-y-6">
             <div className="grid grid-cols-4 gap-4">
                <VitalBox label="Blood Pressure" val={patient.vitals.bp} status="Normal" />
                <VitalBox label="Blood Sugar" val={patient.vitals.sugar} status="Stable" />
                <VitalBox label="Heart Rate" val={patient.vitals.heartRate} status="Resting" />
                <VitalBox label="Weight" val={patient.vitals.weight} status="Stable" />
             </div>

             <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[19px] font-semibold tracking-tight">Prescribed Regimen</h3>
                  <span className="text-[13px] text-[#86868B] bg-[#F5F5F7] px-3 py-1 rounded-full">{patient.medications.length} Active Meds</span>
                </div>
                <div className="space-y-4">
                  {patient.medications.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-[#F5F5F7] rounded-[16px]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-sm"><Pill size={18} className="text-[#007AFF]" /></div>
                        <div><p className="font-semibold text-[15px]">{med.name} {med.dose}</p><p className="text-[13px] text-[#86868B]">{med.route} • {med.frequency}</p></div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#424245]"><Clock size={14} className="text-[#86868B]" /> {med.timing}</div>
                    </div>
                  ))}
                </div>
             </div>

             {/* Laboratory Section with Trigger */}
             <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[19px] font-semibold tracking-tight">Recent Laboratory Observations</h3>
                  <button onClick={() => setShowReport(true)} className="flex items-center gap-2 text-[#007AFF] text-[13px] font-semibold bg-[#007AFF]/5 px-4 py-2 rounded-full hover:bg-[#007AFF]/10 transition-colors">
                     <FileText size={16} /> View Full Report
                  </button>
                </div>
                <div className="flex items-center justify-between p-6 bg-[#1D1D1F] rounded-[20px] text-white shadow-lg">
                   <div><p className="text-[11px] font-semibold opacity-50 uppercase tracking-widest">Diagnostic Panel</p><p className="text-[17px] font-medium">{patient.lastTest.type}</p></div>
                   <div><p className="text-[11px] font-semibold opacity-50 uppercase tracking-widest">Result</p><p className="text-[20px] font-semibold text-blue-400">{patient.lastTest.result}</p></div>
                   <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                      <div className={`w-2 h-2 rounded-full ${patient.lastTest.status === 'Normal' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-[12px] font-semibold uppercase">{patient.lastTest.status}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Lab Report Modal Triggered here */}
      <AnimatePresence>
        {showReport && <LabReportModal isOpen={showReport} onClose={() => setShowReport(false)} patient={patient} />}
      </AnimatePresence>
    </>
  );
};

const VitalBox = ({ label, val, status }) => (
  <div className="bg-white p-5 rounded-[20px] border border-[#E5E5E5] shadow-sm">
    <p className="text-[12px] font-medium text-[#86868B] mb-1">{label}</p>
    <p className="text-[17px] font-semibold">{val}</p>
    <p className="text-[11px] font-medium text-[#34C759] mt-2 flex items-center gap-1"><CheckCircle2 size={12} /> {status}</p>
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
    <div className="flex justify-between items-end mb-10 text-left">
      <div>
        <h2 className="text-[15px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">Morning, Dr. Malhotra</h2>
        <h3 className="text-4xl font-semibold tracking-tight">Health Overview</h3>
      </div>
      <div className="bg-white border border-[#E5E5E5] rounded-full px-5 py-2 flex items-center gap-3 shadow-sm">
        <div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse"></div>
        <span className="text-[14px] font-medium">Live System Status</span>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-6 mb-8 text-left">
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
       <h3 className="text-[19px] font-semibold mb-8 tracking-tight text-left">Network Adherence Performance</h3>
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
