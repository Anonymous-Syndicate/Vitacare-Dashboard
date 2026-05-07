import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, Bell, Search, LayoutDashboard, ShieldCheck, ArrowUpRight, ChevronLeft, Phone, Mail, MapPin, Calendar, Pill, Clock, Info, CheckCircle2, FileText, X, Download, Printer, AlertCircle, Stethoscope, ClipboardList, Utensils, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DIVERSIFIED CLINICAL DATASET ---
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
      { name: "Metformin Glycomet", dose: "500mg", route: "Oral", frequency: "2x Daily", timing: "With Breakfast & Dinner", status: "Active" },
      { name: "Sitagliptin Januvia", dose: "100mg", route: "Oral", frequency: "1x Daily", timing: "Morning (Fixed time)", status: "Active" },
      { name: "Glimepiride Amaryl", dose: "2mg", route: "Oral", frequency: "1x Daily", timing: "Before Breakfast", status: "Active" }
    ], 
    doctorsNote: "Patient showing persistent hyperglycemia. High risk of diabetic retinopathy. Lifestyle: Implement a low-glycemic index (GI) diet immediately. Minimum 30 mins brisk walking daily. Foot hygiene is critical; check for numbness or sores daily.",
    lastTest: { type: "HbA1c / Lipid Profile", date: "Apr 15, 2024", result: "8.4%", status: "Critical" }, 
    vitals: { bp: "145/92 mmHg", sugar: "180 mg/dL", weight: "78.2 kg", heartRate: "82 bpm" },
    report: { labName: "Apollo Diagnostics", reference: "REF-992011", parameters: [{ name: "HbA1c", result: "8.4", unit: "%", range: "4.0 - 5.6", status: "Critical" }, { name: "Fast Blood Sugar", result: "168", unit: "mg/dL", range: "70 - 100", status: "High" }] }
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
      { name: "Amlodipine Amlokind", dose: "5mg", route: "Oral", frequency: "1x Daily", timing: "Morning", status: "Active" },
      { name: "Telmisartan Telma", dose: "40mg", route: "Oral", frequency: "1x Daily", timing: "Bedtime", status: "Active" }
    ], 
    doctorsNote: "BP is well-managed. Patient is responsive to therapy. Lifestyle: Continue DASH diet (Dietary Approaches to Stop Hypertension). Limit sodium intake to <2g per day. Avoid processed papads and pickles. Yoga/Pranayama recommended for stress management.",
    lastTest: { type: "Kidney Function Test", date: "Apr 10, 2024", result: "Creatinine 0.8", status: "Normal" }, 
    vitals: { bp: "118/76 mmHg", sugar: "105 mg/dL", weight: "62.0 kg", heartRate: "72 bpm" } 
  },
  { 
    id: 'VP-103', 
    name: "Vikram Malhotra", 
    age: 68, 
    gender: "Male", 
    condition: "COPD & Emphysema", 
    risk: "Medium", 
    adherence: 78, 
    location: "Delhi", 
    phone: "+91 88001 99000", 
    email: "vikram.m@gmail.com", 
    lastVisit: "May 04, 2024", 
    medications: [
      { name: "Salbutamol Inhaler", dose: "100mcg", route: "Inhalation", frequency: "PRN (As Needed)", timing: "During acute breathlessness", status: "Active" },
      { name: "Budesonide Pulmicort", dose: "400mcg", route: "Inhalation (DPI)", frequency: "2x Daily", timing: "Morning & Evening", status: "Active" },
      { name: "Theophylline", dose: "400mg", route: "Oral", frequency: "1x Daily", timing: "After Dinner", status: "Active" }
    ], 
    doctorsNote: "Reduced lung capacity observed. Patient requires supplemental oxygen at night. Lifestyle: Absolute smoking cessation required. Practice pursed-lip breathing exercises. Avoid outdoor exposure during high AQI days (AQI > 200). Use an air purifier at home.",
    lastTest: { type: "Spirometry", date: "Apr 20, 2024", result: "FEV1 65%", status: "Monitor" }, 
    vitals: { bp: "130/85 mmHg", sugar: "112 mg/dL", weight: "70.5 kg", heartRate: "88 bpm" } 
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
      { name: "Erythropoietin", dose: "4000 IU", route: "Subcutaneous", frequency: "Weekly", timing: "Every Monday Morning", status: "Active" },
      { name: "Sevelamer Carbonate", dose: "800mg", route: "Oral", frequency: "3x Daily", timing: "With Meals", status: "Active" }
    ], 
    doctorsNote: "Renal markers are deteriorating. GFR is dropping. Lifestyle: Restrict daily fluid intake to 1.5 Liters. Low potassium diet (avoid bananas, coconut water). Limit protein intake to 0.6g per kg of body weight. Urgent nephrology consult required.",
    lastTest: { type: "Renal Panel", date: "May 01, 2024", result: "eGFR 32", status: "Critical" }, 
    vitals: { bp: "155/98 mmHg", sugar: "115 mg/dL", weight: "58.0 kg", heartRate: "78 bpm" } 
  },
  { 
    id: 'VP-105', 
    name: "Amit Saxena", 
    age: 50, 
    gender: "Male", 
    condition: "Coronary Artery Disease", 
    risk: "Medium", 
    adherence: 85, 
    location: "Gurgaon", 
    phone: "+91 99001 22334", 
    email: "amit.saxena@gmail.com", 
    lastVisit: "May 06, 2024", 
    medications: [
      { name: "Clopidogrel (Plavix)", dose: "75mg", route: "Oral", frequency: "1x Daily", timing: "After Breakfast", status: "Active" },
      { name: "Rosuvastatin (Crestor)", dose: "20mg", route: "Oral", frequency: "1x Daily", timing: "Night", status: "Active" },
      { name: "Bisoprolol", dose: "2.5mg", route: "Oral", frequency: "1x Daily", timing: "Morning", status: "Active" }
    ], 
    doctorsNote: "Post-stent recovery is stable. Mild chest tightness reported during exertion. Lifestyle: Strictly Mediterranean diet. Zero saturated fats. Avoid sudden heavy lifting. Follow the 5-2-1-0 rule: 5 servings of veg, 2h max screen time, 1h activity, 0 sugary drinks.",
    lastTest: { type: "Lipid Profile", date: "Apr 22, 2024", result: "LDL 115", status: "Monitor" }, 
    vitals: { bp: "128/82 mmHg", sugar: "110 mg/dL", weight: "84.0 kg", heartRate: "68 bpm" } 
  }
];

// Fill out up to 30 patients for the demo
for (let i = 6; i <= 30; i++) {
  PATIENTS.push({
    ...PATIENTS[1], id: `VP-1${i}`, name: i % 2 === 0 ? "Kavita Singh" : "Arjun Verma",
    condition: i % 4 === 0 ? "Hypothyroidism" : "GERD / Acid Reflux",
    risk: i % 5 === 0 ? "High" : "Low", adherence: 60 + (i % 40),
  });
}

const ADHERENCE_DATA = [ { n: 'Mon', a: 65 }, { n: 'Tue', a: 70 }, { n: 'Wed', a: 68 }, { n: 'Thu', a: 85 }, { n: 'Fri', a: 90 }, { n: 'Sat', a: 92 }, { n: 'Sun', a: 94 } ];
const RISK_CHART_DATA = [ { name: 'High Risk', value: 12, color: '#FF3B30' }, { name: 'Medium Risk', value: 28, color: '#FF9500' }, { name: 'Low Risk', value: 60, color: '#34C759' } ];

// --- COMPONENTS ---

const LabReportModal = ({ isOpen, onClose, patient }) => {
  if (!isOpen || !patient || !patient.report) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1D1D1F]/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[28px] shadow-2xl flex flex-col">
        <div className="p-8 border-b border-[#F5F5F7] flex justify-between items-start">
          <div><h3 className="text-2xl font-semibold tracking-tight">Diagnostic Analysis</h3><p className="text-[#86868B] text-[14px] mt-1">{patient.report.labName} • {patient.report.reference}</p></div>
          <button onClick={onClose} className="p-2 bg-[#F5F5F7] rounded-full text-[#86868B] hover:text-[#1D1D1F] transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="bg-white border border-[#E5E5E5] rounded-[20px] overflow-hidden">
             <table className="w-full text-left text-[14px]"><thead className="bg-[#FBFBFD] border-b border-[#E5E5E5] text-[#86868B]"><tr><th className="px-6 py-3 font-medium">Parameter</th><th className="px-6 py-3 text-center">Result</th><th className="px-6 py-3 text-right">Range</th></tr></thead>
               <tbody className="divide-y divide-[#F5F5F7]">{patient.report.parameters.map((p, i) => (<tr key={i}><td className="px-6 py-4 font-medium text-[#1D1D1F]">{p.name}</td><td className="px-6 py-4 text-center"><span className={`font-bold ${p.status === 'Normal' ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>{p.result}</span><span className="text-[12px] text-[#86868B] ml-1">{p.unit}</span></td><td className="px-6 py-4 text-right text-[#86868B] font-mono text-[13px]">{p.range}</td></tr>))}</tbody>
             </table>
          </div>
        </div>
        <div className="p-6 bg-[#F5F5F7] border-t border-[#E5E5E5] flex justify-end gap-3"><button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E5E5] rounded-full text-[14px] font-medium"><Printer size={16} /> Print</button><button className="flex items-center gap-2 px-6 py-2.5 bg-[#1D1D1F] text-white rounded-full text-[14px] font-medium"><Download size={16} /> Export PDF</button></div>
      </motion.div>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [ { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/" }, { icon: <Users size={20} />, label: "Patients", path: "/patients" } ];
  return (
    <aside className="w-64 bg-[#F5F5F7] border-r border-[#E5E5E5] p-8 flex flex-col fixed h-full select-none">
      <div className="flex items-center gap-3 mb-12"><div className="w-10 h-10 bg-[#007AFF] rounded-[10px] flex items-center justify-center"><ShieldCheck className="text-white" size={22} /></div><h1 className="text-[20px] font-semibold tracking-tight text-[#1D1D1F]">VitalPath</h1></div>
      <nav className="flex-1 space-y-1">{menuItems.map((item) => (<Link key={item.label} to={item.path} className="no-underline"><div className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200 ${location.pathname === item.path ? 'bg-white text-[#007AFF] shadow-sm font-medium' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}>{item.icon} <span className="text-[15px]">{item.label}</span></div></Link>))}</nav>
    </aside>
  );
};

const PatientList = () => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => PATIENTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl">
      <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-semibold tracking-tight">Patients</h2><div className="relative"><Search className="absolute left-4 top-3 text-[#86868B]" size={18} /><input type="text" placeholder="Search database..." className="pl-11 pr-6 py-2.5 bg-[#E8E8ED] border-none rounded-full w-80 text-[15px] outline-none focus:bg-white transition-all" onChange={(e) => setQuery(e.target.value)}/></div></div>
      <div className="bg-white rounded-[20px] border border-[#E5E5E5] overflow-hidden shadow-sm">
        <table className="w-full text-left"><thead className="bg-[#FBFBFD] border-b border-[#E5E5E5] text-[13px] font-medium text-[#86868B]"><tr><th className="px-8 py-4">Identity</th><th className="px-8 py-4">Clinical Condition</th><th className="px-8 py-4">Risk Level</th><th className="px-8 py-4 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-[#F5F5F7]">{filtered.map(p => (<tr key={p.id} className="hover:bg-[#F5F5F7]/50 transition-colors group cursor-pointer"><td className="px-8 py-5 text-left"><p className="font-medium text-[#1D1D1F]">{p.name}</p><p className="text-[13px] text-[#86868B]">{p.id}</p></td><td className="px-8 py-5 text-left text-[14px] text-[#424245]">{p.condition}</td><td className="px-8 py-5 text-left"><span className={`px-3 py-1 rounded-full text-[12px] font-medium ${p.risk === 'High' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-[#34C759]/10 text-[#34C759]'}`}>{p.risk}</span></td><td className="px-8 py-5 text-right"><Link to={`/patient/${p.id}`} className="text-[#007AFF] opacity-0 group-hover:opacity-100"><ArrowUpRight size={20} /></Link></td></tr>))}</tbody>
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
        <button onClick={() => navigate('/patients')} className="flex items-center gap-2 text-[#007AFF] font-medium text-[15px] mb-8 group"><ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back</button>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm"><div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center text-[#86868B] text-2xl font-semibold mb-6">{patient.name.charAt(0)}</div><h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">{patient.name}</h2><p className="text-[15px] text-[#86868B] mb-8">{patient.id} • {patient.age}Y • {patient.gender}</p>
              <div className="space-y-4 text-[14px] text-[#424245] text-left"><div className="flex items-center gap-3"><Phone size={16} className="text-[#86868B]" /> {patient.phone}</div><div className="flex items-center gap-3"><Mail size={16} className="text-[#86868B]" /> {patient.email}</div><div className="flex items-center gap-3"><MapPin size={16} className="text-[#86868B]" /> {patient.location}</div><div className="flex items-center gap-3"><Calendar size={16} className="text-[#86868B]" /> Last Visit: {patient.lastVisit}</div></div>
            </div>
            <div className="bg-[#007AFF] p-8 rounded-[24px] text-white text-left"><p className="text-[13px] font-medium opacity-70 mb-2 uppercase tracking-wide">Adherence</p><div className="text-5xl font-semibold tracking-tighter mb-4">{patient.adherence}%</div><div className="flex items-start gap-2 bg-white/10 p-4 rounded-[12px] text-[13px] leading-relaxed"><Info size={16} className="mt-0.5 shrink-0" />AI Detection: Fluctuating dosage detected. Patient requires a follow-up call.</div></div>
          </div>
          <div className="col-span-8 space-y-6">
             <div className="grid grid-cols-4 gap-4"><VitalBox label="BP" val={patient.vitals.bp} /><VitalBox label="Sugar" val={patient.vitals.sugar} /><VitalBox label="Heart" val={patient.vitals.heartRate} /><VitalBox label="Weight" val={patient.vitals.weight} /></div>

             {/* DOCTOR'S NOTE SECTION */}
             <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm text-left">
                <div className="flex items-center gap-2 mb-4 text-[#FF9500]"><Stethoscope size={20} /> <h3 className="text-[18px] font-semibold tracking-tight">Clinical & Lifestyle Directives</h3></div>
                <div className="bg-[#FFF9F2] border border-[#FFE8CC] p-6 rounded-[20px] text-[14px] text-[#8F5E00] leading-relaxed">
                   {patient.doctorsNote}
                </div>
             </div>

             <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm text-left"><div className="flex items-center justify-between mb-8"><h3 className="text-[19px] font-semibold tracking-tight">Clinical Regimen</h3><span className="text-[13px] text-[#86868B] bg-[#F5F5F7] px-3 py-1 rounded-full">{patient.medications.length} Meds</span></div>
                <div className="space-y-4">{patient.medications.map((med, i) => (<div key={i} className="flex items-center justify-between p-5 bg-[#F5F5F7] rounded-[16px]"><div className="flex items-center gap-4 text-left"><div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-sm"><Pill size={18} className="text-[#007AFF]" /></div><div><p className="font-semibold text-[15px]">{med.name} {med.dose}</p><p className="text-[13px] text-[#86868B]">{med.route} • {med.frequency}</p></div></div><div className="flex items-center gap-1.5 text-[13px] font-medium text-[#424245]"><Clock size={14} className="text-[#86868B]" /> {med.timing}</div></div>))}</div>
             </div>
             
             <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm text-left"><div className="flex justify-between items-center mb-8"><h3 className="text-[19px] font-semibold tracking-tight">Laboratory Results</h3><button onClick={() => setShowReport(true)} className="flex items-center gap-2 text-[#007AFF] text-[13px] font-semibold bg-[#007AFF]/5 px-4 py-2 rounded-full hover:bg-[#007AFF]/10 transition-colors"><FileText size={16} /> View Report</button></div>
                <div className="flex items-center justify-between p-6 bg-[#1D1D1F] rounded-[20px] text-white shadow-lg text-left"><div><p className="text-[11px] font-semibold opacity-50 uppercase tracking-widest">Test</p><p className="text-[17px] font-medium">{patient.lastTest.type}</p></div><div><p className="text-[11px] font-semibold opacity-50 uppercase tracking-widest">Result</p><p className="text-[20px] font-semibold text-blue-400">{patient.lastTest.result}</p></div><div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20"><div className={`w-2 h-2 rounded-full ${patient.lastTest.status === 'Normal' ? 'bg-green-400' : 'bg-red-400'}`}></div><span className="text-[12px] font-semibold uppercase">{patient.lastTest.status}</span></div></div>
             </div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>{showReport && <LabReportModal isOpen={showReport} onClose={() => setShowReport(false)} patient={patient} />}</AnimatePresence>
    </>
  );
};

const VitalBox = ({ label, val }) => (
  <div className="bg-white p-5 rounded-[20px] border border-[#E5E5E5] text-left"><p className="text-[12px] font-medium text-[#86868B] mb-1">{label}</p><p className="text-[17px] font-semibold text-[#1D1D1F]">{val}</p></div>
);

// --- OVERVIEW PAGE ---

const Overview = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl pb-20">
      <div className="flex justify-between items-end mb-10 text-left">
        <div><h2 className="text-[15px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">Today • May 07</h2><h3 className="text-4xl font-semibold tracking-tight">Morning, Dr. Malhotra</h3></div>
        <div className="bg-white border border-[#E5E5E5] rounded-full px-5 py-2 flex items-center gap-3 shadow-sm font-medium text-[14px]"><div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse"></div> Clinical Sync Active</div>
      </div>
      <div className="grid grid-cols-4 gap-6 mb-10 text-left">
        <OverviewStatCard title="Avg Adherence" value="88.4%" change="+2.4%" />
        <OverviewStatCard title="Critical Risks" value="04" change="-1" color="text-[#FF3B30]" />
        <OverviewStatCard title="Active Plans" value="1,240" change="+12" />
        <OverviewStatCard title="Today's Visit" value="18" change="In Queue" color="text-[#007AFF]" />
      </div>
      <div className="grid grid-cols-12 gap-8 text-left">
        <div className="col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-[#E5E5E5] shadow-sm"><h3 className="text-[19px] font-semibold mb-8 tracking-tight">Adherence Performance</h3>
             <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={ADHERENCE_DATA}><defs><linearGradient id="appleBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#007AFF" stopOpacity={0.15}/><stop offset="95%" stopColor="#007AFF" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: '#86868B', fontSize: 12}} dy={10} /><YAxis hide /><Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}} /><Area type="monotone" dataKey="a" stroke="#007AFF" strokeWidth={3} fill="url(#appleBlue)" /></AreaChart></ResponsiveContainer></div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-[#E5E5E5] shadow-sm"><h3 className="text-[19px] font-semibold mb-6 flex items-center gap-2"><AlertCircle size={20} className="text-[#FF3B30]" /> Critical Priority Feed</h3>
            <div className="space-y-4"><AlertItem name="Priya Nair" desc="HbA1c critical deviation (8.4%)" time="12m ago" /><AlertItem name="Suresh Iyengar" desc="3 missed doses in 48 hours" time="45m ago" /><AlertItem name="Vikram Malhotra" desc="SpO2 fluctuation (91%)" time="1h ago" /></div>
            <button onClick={() => navigate('/patients')} className="w-full mt-6 py-4 bg-[#F5F5F7] rounded-[16px] text-[14px] font-semibold text-[#86868B] hover:bg-[#E8E8ED] transition-colors">Audit All Logs</button>
          </div>
        </div>
        <div className="col-span-4 space-y-8 text-left">
           <div className="bg-white p-8 rounded-[32px] border border-[#E5E5E5] shadow-sm"><h3 className="text-[17px] font-semibold mb-6">Patient Segmentation</h3>
              <div className="h-[200px] flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={RISK_CHART_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{RISK_CHART_DATA.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
              <div className="mt-4 space-y-3">{RISK_CHART_DATA.map(item => (<div key={item.name} className="flex justify-between items-center text-[13px] font-medium"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{background: item.color}}></div> <span className="text-[#86868B]">{item.name}</span></div><span>{item.value}%</span></div>))}</div>
           </div>
           <div className="bg-white p-8 rounded-[32px] border border-[#E5E5E5] shadow-sm text-left"><h3 className="text-[17px] font-semibold mb-6 flex items-center gap-2"><Clock size={18} className="text-[#007AFF]" /> Schedule</h3>
              <div className="space-y-6 relative"><div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-[#F5F5F7]"></div><ScheduleItem time="09:00" patient="Vikram Malhotra" type="In-person" color="#007AFF" /><ScheduleItem time="11:30" patient="Anjali Deshmukh" type="Tele-health" color="#34C759" /><ScheduleItem time="14:15" patient="Priya Verma" type="Lab Review" color="#FF9500" /></div>
           </div>
        </div>
      </div>
    </div>
  );
};

const OverviewStatCard = ({ title, value, change, color = "text-[#1D1D1F]" }) => (
  <div className="bg-white p-8 rounded-[24px] border border-[#E5E5E5] shadow-sm text-left"><p className="text-[13px] font-medium text-[#86868B] uppercase tracking-wide">{title}</p><div className="flex items-baseline gap-2 mt-2"><h4 className={`text-4xl font-semibold tracking-tight ${color}`}>{value}</h4><span className="text-[12px] font-bold text-[#34C759]">{change}</span></div></div>
);

const AlertItem = ({ name, desc, time }) => (
  <div className="flex items-center justify-between p-4 bg-[#FBFBFD] border border-[#F5F5F7] rounded-[20px] text-left"><div className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full"></div><div><p className="text-[14px] font-semibold text-[#1D1D1F]">{name}</p><p className="text-[13px] text-[#86868B]">{desc}</p></div></div><span className="text-[12px] font-medium text-[#86868B]">{time}</span></div>
);

const ScheduleItem = ({ time, patient, type, color }) => (
  <div className="pl-6 relative text-left"><div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm" style={{backgroundColor: color}}></div><p className="text-[11px] font-bold text-[#86868B]">{time}</p><p className="text-[14px] font-semibold text-[#1D1D1F] mt-0.5">{patient}</p><p className="text-[12px] font-medium opacity-60 uppercase tracking-wide">{type}</p></div>
);

export default function App() {
  return (
    <Router><div className="flex min-h-screen bg-[#FBFBFD] text-[#1D1D1F] antialiased text-left"><Sidebar /><main className="flex-1 ml-64 p-12 text-left"><Routes><Route path="/" element={<Overview />} /><Route path="/patients" element={<PatientList />} /><Route path="/patient/:id" element={<PatientProfile />} /></Routes></main></div></Router>
  );
}
