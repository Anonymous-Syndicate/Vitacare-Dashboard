import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, Bell, Search, LayoutDashboard, ShieldCheck, ArrowUpRight, ChevronLeft, Phone, Mail, MapPin, Calendar, Pill, Clock, Info, CheckCircle2, FileText, X, Download, Printer, AlertCircle, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATASET: 30 UNIQUE CLINICAL PROFILES ---
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
      { name: "Metformin Glycomet", dose: "500mg", route: "Oral", frequency: "2x Daily", timing: "With Breakfast & Dinner" },
      { name: "Sitagliptin Januvia", dose: "100mg", route: "Oral", frequency: "1x Daily", timing: "Morning" }
    ], 
    doctorsNote: "Patient showing persistent hyperglycemia. Lifestyle: Implement low-GI diet. Minimum 30 mins brisk walking. Check feet for numbness daily.",
    vitals: { bp: "145/92 mmHg", sugar: "180 mg/dL", weight: "78kg", heartRate: "82 bpm" },
    report: {
      type: "Diabetic Panel",
      date: "Apr 15, 2024",
      result: "HbA1c 8.4%",
      status: "Critical",
      parameters: [
        { name: "HbA1c (Glycated Hemoglobin)", result: "8.4", unit: "%", range: "4.0 - 5.6", status: "Critical" },
        { name: "Fast Blood Sugar", result: "168", unit: "mg/dL", range: "70 - 100", status: "High" },
        { name: "Post-Prandial Sugar", result: "210", unit: "mg/dL", range: "120 - 140", status: "High" }
      ]
    }
  },
  { 
    id: 'VP-102', 
    name: "Anjali Deshmukh", 
    age: 55, 
    gender: "Female", 
    condition: "Hypertension (Grade II)", 
    risk: "Low", 
    adherence: 95, 
    location: "Mumbai", 
    phone: "+91 91234 56789", 
    email: "anjali.d@outlook.com", 
    lastVisit: "Apr 28, 2024", 
    medications: [
      { name: "Amlodipine Amlokind", dose: "5mg", route: "Oral", frequency: "1x Daily", timing: "Morning" },
      { name: "Telmisartan Telma", dose: "40mg", route: "Oral", frequency: "1x Daily", timing: "Bedtime" }
    ], 
    doctorsNote: "BP well managed. Lifestyle: Continue DASH diet. Limit sodium to <2g. Avoid pickles/processed snacks. Yoga for stress.",
    vitals: { bp: "118/76 mmHg", sugar: "105 mg/dL", weight: "62kg", heartRate: "72 bpm" },
    report: {
      type: "Lipid & Renal Profile",
      date: "Apr 10, 2024",
      result: "Normal",
      status: "Normal",
      parameters: [
        { name: "Total Cholesterol", result: "185", unit: "mg/dL", range: "< 200", status: "Normal" },
        { name: "Serum Creatinine", result: "0.8", unit: "mg/dL", range: "0.6 - 1.1", status: "Normal" },
        { name: "Serum Potassium", result: "4.2", unit: "mEq/L", range: "3.5 - 5.0", status: "Normal" }
      ]
    }
  },
  { 
    id: 'VP-103', 
    name: "Vikram Malhotra", 
    age: 68, 
    gender: "Male", 
    condition: "COPD / Emphysema", 
    risk: "Medium", 
    adherence: 78, 
    location: "Delhi", 
    phone: "+91 88001 99000", 
    email: "vikram.m@gmail.com", 
    lastVisit: "May 04, 2024", 
    medications: [
      { name: "Salbutamol Inhaler", dose: "100mcg", route: "Inhalation", frequency: "PRN", timing: "Emergency Use" },
      { name: "Budesonide Pulmicort", dose: "400mcg", route: "Inhalation", frequency: "2x Daily", timing: "Morning & Evening" }
    ], 
    doctorsNote: "Reduced lung capacity. Lifestyle: Absolute smoking cessation. Use air purifier. Practice pursed-lip breathing daily.",
    vitals: { bp: "130/85 mmHg", sugar: "112 mg/dL", weight: "70kg", heartRate: "88 bpm" },
    report: {
      type: "Pulmonary Function",
      date: "Apr 20, 2024",
      result: "FEV1 65%",
      status: "Monitor",
      parameters: [
        { name: "FEV1", result: "65", unit: "%", range: "> 80", status: "Low" },
        { name: "FEV1/FVC Ratio", result: "0.62", unit: "", range: "> 0.70", status: "Low" },
        { name: "SPO2 (Room Air)", result: "94", unit: "%", range: "95 - 100", status: "Monitor" }
      ]
    }
  },
  { 
    id: 'VP-104', 
    name: "Priya Nair", 
    age: 45, 
    gender: "Female", 
    condition: "CKD (Stage 3b)", 
    risk: "High", 
    adherence: 30, 
    location: "Chennai", 
    phone: "+91 77665 44332", 
    email: "priya.n@yahoo.com", 
    lastVisit: "Apr 15, 2024", 
    medications: [
      { name: "Erythropoietin", dose: "4000 IU", route: "Subcutaneous", frequency: "Weekly", timing: "Monday Morning" },
      { name: "Sevelamer Carbonate", dose: "800mg", route: "Oral", frequency: "3x Daily", timing: "With Meals" }
    ], 
    doctorsNote: "Renal markers deteriorating. Lifestyle: Restrict fluid to 1.5L. Low protein diet. Avoid bananas/coconut water (high K+).",
    vitals: { bp: "155/98 mmHg", sugar: "115 mg/dL", weight: "58kg", heartRate: "78 bpm" },
    report: {
      type: "Renal Function",
      date: "May 01, 2024",
      result: "eGFR 32",
      status: "Critical",
      parameters: [
        { name: "eGFR", result: "32", unit: "mL/min", range: "> 60", status: "Critical" },
        { name: "Serum Urea", result: "58", unit: "mg/dL", range: "15 - 45", status: "High" },
        { name: "Uric Acid", result: "8.2", unit: "mg/dL", range: "2.4 - 6.0", status: "High" }
      ]
    }
  }
];

// Generate 26 more distinct patients
const cities = ["Pune", "Gurgaon", "Kolkata", "Hyderabad", "Jaipur"];
const conditions = ["Asthma", "Heart Failure", "Hyperthyroidism", "Gastroenteritis"];
for (let i = 5; i <= 30; i++) {
  const cond = conditions[i % conditions.length];
  PATIENTS.push({
    ...PATIENTS[1],
    id: `VP-1${i}`,
    name: i % 2 === 0 ? `Kavita ${i} Singh` : `Arjun ${i} Verma`,
    age: 40 + (i % 30),
    condition: cond,
    risk: i % 7 === 0 ? "High" : "Low",
    adherence: 60 + (i % 38),
    location: cities[i % cities.length],
    report: {
      ...PATIENTS[1].report,
      type: `${cond} General Panel`
    }
  });
}

const CHART_DATA = [ { n: 'Mon', a: 65 }, { n: 'Tue', a: 70 }, { n: 'Wed', a: 68 }, { n: 'Thu', a: 85 }, { n: 'Fri', a: 90 }, { n: 'Sat', a: 92 }, { n: 'Sun', a: 94 } ];
const RISK_DATA = [ { name: 'High', value: 12, color: '#FF3B30' }, { name: 'Med', value: 28, color: '#FF9500' }, { name: 'Low', value: 60, color: '#34C759' } ];

// --- UI COMPONENTS ---

const LabReportModal = ({ patient, onClose }) => {
  if (!patient) return null;
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} className="relative bg-white w-full max-w-3xl overflow-hidden rounded-[30px] shadow-2xl flex flex-col max-h-full print:shadow-none print:rounded-none">
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center print:hidden">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">Lab Diagnostic Report</h3>
            <p className="text-[13px] text-[#86868B] mt-0.5">{patient.report.type} • ID: {patient.id}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-[#F5F5F7] rounded-full text-[#86868B] hover:text-black transition-colors"><X size={20} /></button>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-10 print:overflow-visible">
          <div className="flex justify-between items-start mb-10">
             <div className="space-y-1">
               <h2 className="text-2xl font-bold tracking-tighter text-[#007AFF]">VitalPath Healthcare</h2>
               <p className="text-[12px] text-[#86868B] font-medium">Cloud Integrated Diagnostic Service</p>
             </div>
             <div className="text-right space-y-1">
               <p className="text-[12px] font-bold uppercase text-[#86868B]">Reference Number</p>
               <p className="text-[15px] font-semibold">REF-{Math.floor(Math.random() * 900000) + 100000}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10 border-y border-gray-100 py-8">
            <div className="space-y-4">
              <DataLabel label="Patient Name" val={patient.name} />
              <DataLabel label="Age / Gender" val={`${patient.age}Y / ${patient.gender}`} />
            </div>
            <div className="space-y-4">
              <DataLabel label="Collection Date" val={patient.report.date} />
              <DataLabel label="Clinician" val="Dr. Malhotra" />
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="text-[11px] font-bold uppercase tracking-widest text-[#86868B] border-b border-gray-100">
              <tr>
                <th className="pb-4">Investigation</th>
                <th className="pb-4 text-center">Observed Value</th>
                <th className="pb-4 text-right">Reference Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patient.report.parameters.map((p, idx) => (
                <tr key={idx} className="text-[14px]">
                  <td className="py-5 font-semibold text-slate-800">{p.name}</td>
                  <td className="py-5 text-center">
                    <span className={`font-bold ${p.status !== 'Normal' ? 'text-[#FF3B30]' : 'text-slate-900'}`}>{p.result}</span>
                    <span className="text-[11px] text-[#86868B] ml-1 font-medium">{p.unit}</span>
                  </td>
                  <td className="py-5 text-right font-mono text-[12px] text-[#86868B]">{p.range}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-12 p-6 bg-[#FBFBFD] rounded-[20px] border border-gray-50">
            <h5 className="text-[12px] font-bold uppercase text-[#86868B] mb-2">Automated Interpretation</h5>
            <p className="text-[13px] leading-relaxed text-slate-700 font-medium">The results for {patient.report.type} indicate {patient.report.status === 'Critical' ? 'significant deviation from standard ranges.' : 'stable health metrics.'} Patient adherence is currently {patient.adherence}%. Professional intervention recommended.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-gray-50 flex justify-end gap-3 print:hidden">
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-[#F5F5F7] text-slate-900 rounded-full text-[14px] font-semibold hover:bg-gray-200 transition-all"><Printer size={16} /> Print Report</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-8 py-2.5 bg-black text-white rounded-full text-[14px] font-semibold hover:opacity-80 transition-all"><Download size={16} /> Download PDF</button>
        </div>
      </motion.div>
    </div>
  );
};

const DataLabel = ({ label, val }) => (
  <div>
    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">{label}</p>
    <p className="text-[15px] font-semibold text-slate-900 mt-0.5">{val}</p>
  </div>
);

const Sidebar = () => {
  const loc = useLocation();
  const items = [{ icon: <LayoutDashboard size={18} />, label: "Overview", path: "/" }, { icon: <Users size={18} />, label: "Patients", path: "/patients" }];
  return (
    <aside className="w-64 bg-[#F5F5F7] border-r border-gray-200 p-8 flex flex-col fixed h-full select-none print:hidden">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-9 h-9 bg-[#007AFF] rounded-[10px] flex items-center justify-center shadow-sm"><ShieldCheck className="text-white" size={20} /></div>
        <h1 className="text-[18px] font-bold tracking-tight text-[#1D1D1F]">VitalPath</h1>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map(item => (
          <Link key={item.label} to={item.path} className="no-underline">
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${loc.pathname === item.path ? 'bg-white text-[#007AFF] shadow-sm font-semibold' : 'text-[#86868B] hover:text-black'}`}>
              {item.icon} <span className="text-[14px]">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

// --- PAGES ---

const Overview = () => {
  const nav = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl pb-20">
      <header className="flex justify-between items-end mb-10 text-left">
        <div>
          <p className="text-[14px] font-semibold text-[#86868B] mb-1">Morning, Dr. Malhotra</p>
          <h2 className="text-3xl font-bold tracking-tight">Clinic Status</h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-full px-5 py-2 flex items-center gap-3 text-[13px] font-semibold shadow-sm">
          <div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse"></div> Clinical Sync Live
        </div>
      </header>

      <div className="grid grid-cols-4 gap-6 mb-10 text-left">
        <StatCard title="Adherence" val="88.4%" change="+2.4%" />
        <StatCard title="Critical" val="04" change="-1" color="text-[#FF3B30]" />
        <StatCard title="Active Plans" val="1,240" change="+12" />
        <StatCard title="Queue" val="18" change="Wait" color="text-[#007AFF]" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm text-left">
           <h3 className="text-[18px] font-bold mb-8">Patient Adherence Metrics</h3>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs><linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#007AFF" stopOpacity={0.1}/><stop offset="95%" stopColor="#007AFF" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: '#86868B', fontSize: 12}} dy={10} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.06)'}} />
                  <Area type="monotone" dataKey="a" stroke="#007AFF" strokeWidth={3} fill="url(#blueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="col-span-4 bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm text-left">
          <h3 className="text-[17px] font-bold mb-6">Risk Segmentation</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RISK_DATA} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                  {RISK_DATA.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
             {RISK_DATA.map(r => (
               <div key={r.name} className="flex justify-between text-[13px] font-semibold text-[#86868B]">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: r.color}}></div> {r.name}</div>
                 <span className="text-slate-900">{r.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PatientList = () => {
  const [q, setQ] = useState("");
  const filtered = PATIENTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl">
      <div className="flex justify-between items-center mb-10 text-left">
        <h2 className="text-3xl font-bold tracking-tight">Directory</h2>
        <div className="relative">
          <Search className="absolute left-4 top-3 text-[#86868B]" size={18} />
          <input type="text" placeholder="Search by name..." className="pl-11 pr-6 py-2.5 bg-[#E8E8ED] rounded-full w-80 text-[14px] outline-none focus:bg-white transition-all font-medium" onChange={e => setQ(e.target.value)} />
        </div>
      </div>
      <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FBFBFD] text-[11px] font-bold uppercase tracking-widest text-[#86868B] border-b border-gray-100">
            <tr><th className="px-8 py-4">Identity</th><th className="px-8 py-4">Condition</th><th className="px-8 py-4">Risk</th><th className="px-8 py-4 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[14px]">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5 font-semibold text-slate-800">{p.name}<p className="text-[12px] text-[#86868B] font-medium">{p.id}</p></td>
                <td className="px-8 py-5 font-medium text-slate-600">{p.condition}</td>
                <td className="px-8 py-5"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${p.risk === 'High' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-[#34C759]/10 text-[#34C759]'}`}>{p.risk}</span></td>
                <td className="px-8 py-5 text-right"><Link to={`/patient/${p.id}`} className="text-[#007AFF] opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight size={20} /></Link></td>
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
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const p = PATIENTS.find(x => x.id === id);
  if (!p) return null;

  return (
    <>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl pb-20">
        <button onClick={() => nav('/patients')} className="flex items-center gap-2 text-[#007AFF] font-bold text-[14px] mb-8 hover:translate-x-[-4px] transition-transform"><ChevronLeft size={18} /> Back</button>
        <div className="grid grid-cols-12 gap-8 text-left">
          <div className="col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm text-left">
              <div className="w-16 h-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-[24px] font-bold text-[#86868B] mb-6">{p.name.charAt(0)}</div>
              <h2 className="text-2xl font-bold tracking-tight">{p.name}</h2>
              <p className="text-[14px] text-[#86868B] font-semibold mb-8">{p.id} • {p.age}Y • {p.gender}</p>
              <div className="space-y-4 text-[13px] font-bold text-slate-600">
                <div className="flex items-center gap-3"><Phone size={16} className="text-[#86868B]" /> {p.phone}</div>
                <div className="flex items-center gap-3"><Mail size={16} className="text-[#86868B]" /> {p.email}</div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-[#86868B]" /> {p.location}</div>
                <div className="flex items-center gap-3"><Calendar size={16} className="text-[#86868B]" /> Visit: {p.lastVisit}</div>
              </div>
            </div>
            <div className="bg-[#007AFF] p-8 rounded-[30px] text-white shadow-xl shadow-blue-100">
               <p className="text-[11px] font-bold opacity-60 uppercase tracking-widest">Adherence</p>
               <h4 className="text-5xl font-bold tracking-tighter mt-1">{p.adherence}%</h4>
               <div className="mt-6 flex items-start gap-2 bg-white/10 p-4 rounded-xl text-[12px] font-medium"><Info size={14} className="shrink-0 mt-0.5" /> AI Insight: High risk of complication due to medication non-compliance.</div>
            </div>
          </div>

          <div className="col-span-8 space-y-6">
             <div className="grid grid-cols-4 gap-4">
                <VitalBox lab="BP" val={p.vitals.bp} />
                <VitalBox lab="Sugar" val={p.vitals.sugar} />
                <VitalBox lab="Heart" val={p.vitals.heartRate} />
                <VitalBox lab="Weight" val={p.vitals.weight} />
             </div>

             <div className="bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#FF9500]"><Stethoscope size={18} /> <h4 className="text-[16px] font-bold uppercase tracking-tight">Doctor's Clinical Note</h4></div>
                <p className="text-[14px] font-semibold leading-relaxed text-slate-700 bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50">{p.doctorsNote}</p>
             </div>

             <div className="bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm">
                <h4 className="text-[18px] font-bold mb-8">Clinical Regimen</h4>
                <div className="space-y-4">{p.medications.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#FBFBFD] rounded-2xl">
                    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"><Pill size={18} className="text-[#007AFF]" /></div><div><p className="font-bold text-[15px]">{m.name} {m.dose}</p><p className="text-[12px] text-[#86868B] font-medium">{m.route} • {m.frequency}</p></div></div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600"><Clock size={14} /> {m.timing}</div>
                  </div>
                ))}</div>
             </div>

             <div className="bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h4 className="text-[18px] font-bold">Diagnostic Observation</h4>
                   <button onClick={() => setShow(true)} className="flex items-center gap-2 text-[#007AFF] text-[13px] font-bold bg-[#007AFF]/5 px-4 py-2 rounded-full hover:bg-[#007AFF]/10 transition-all"><FileText size={16} /> View Full Report</button>
                </div>
                <div className="bg-[#1D1D1F] p-6 rounded-[24px] flex justify-between items-center shadow-lg">
                   <div><p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Diagnostic Panel</p><p className="text-[16px] font-semibold text-white mt-1">{p.report.type}</p></div>
                   <div><p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Latest Value</p><p className="text-[20px] font-bold text-blue-400 mt-1">{p.report.result}</p></div>
                   <div className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase ${p.report.status === 'Normal' ? 'bg-[#34C759] text-white' : 'bg-[#FF3B30] text-white'}`}>{p.report.status}</div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>{show && <LabReportModal patient={p} onClose={() => setShow(false)} />}</AnimatePresence>
    </>
  );
};

const StatCard = ({ title, val, change, color = "text-black" }) => (
  <div className="bg-white p-8 rounded-[24px] border border-gray-200 shadow-sm">
    <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest">{title}</p>
    <div className="flex items-baseline gap-2 mt-2">
      <h4 className={`text-4xl font-bold tracking-tighter ${color}`}>{val}</h4>
      <span className="text-[11px] font-bold text-[#34C759]">{change}</span>
    </div>
  </div>
);

const VitalBox = ({ lab, val }) => (
  <div className="bg-white p-5 rounded-[22px] border border-gray-200">
    <p className="text-[11px] font-bold text-[#86868B] mb-1 uppercase tracking-wider">{lab}</p>
    <p className="text-[16px] font-bold text-slate-800">{val}</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#FBFBFD] text-slate-900 antialiased font-sans">
        <Sidebar />
        <main className="flex-1 ml-64 p-12 text-left">
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
