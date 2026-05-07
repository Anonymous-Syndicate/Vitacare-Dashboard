import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, Bell, Search, LayoutDashboard, ShieldCheck, ArrowUpRight, ChevronLeft, Phone, Mail, MapPin, Calendar, Pill, Clock, Info, CheckCircle2, FileText, X, Download, Printer, AlertCircle, Stethoscope, Droplets, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATASET: CLINICALLY SPECIFIC LABORATORY DATA ---
const PATIENTS = [
  { 
    id: 'VP-101', 
    name: "Suresh Iyengar", 
    age: 62, gender: "Male", condition: "Type 2 Diabetes", risk: "High", adherence: 42,
    location: "Bangalore", phone: "+91 98450 12345", email: "suresh.i@gmail.com", lastVisit: "May 01, 2024", 
    vitals: { bp: "145/92 mmHg", sugar: "180 mg/dL", weight: "78kg", heartRate: "82 bpm" },
    doctorsNote: "Hyperglycemia persists despite Metformin. Lifestyle: Switch to brown rice/millets. Brisk walking 40 mins. Diabetic footwear advised.",
    medications: [
      { name: "Metformin Glycomet", dose: "500mg", route: "Oral", frequency: "2x Daily", timing: "Post-meals" },
      { name: "Sitagliptin Januvia", dose: "100mg", route: "Oral", frequency: "1x Daily", timing: "Morning" }
    ],
    report: {
      labName: "Apollo Health City - Diagnostics",
      reference: "HB-DIA-9920",
      type: "Diabetic & Lipid Panel",
      date: "Apr 15, 2024",
      result: "HbA1c 8.4%", status: "Critical",
      sections: [
        {
          group: "Glycemic Index",
          tests: [
            { name: "HbA1c (Glycated Hb)", val: "8.4", unit: "%", range: "4.0 - 5.6", flag: "Critical" },
            { name: "Fasting Blood Sugar", val: "168", unit: "mg/dL", range: "70 - 100", flag: "High" },
            { name: "Post Prandial (2hr)", val: "242", unit: "mg/dL", range: "110 - 140", flag: "High" }
          ]
        },
        {
          group: "Lipid Profile",
          tests: [
            { name: "Total Cholesterol", val: "210", unit: "mg/dL", range: "125 - 200", flag: "High" },
            { name: "LDL (Bad Cholesterol)", val: "145", unit: "mg/dL", range: "< 100", flag: "High" },
            { name: "HDL (Good Cholesterol)", val: "38", unit: "mg/dL", range: "> 40", flag: "Low" }
          ]
        }
      ]
    }
  },
  { 
    id: 'VP-102', 
    name: "Anjali Deshmukh", 
    age: 55, gender: "Female", condition: "Hypertension", risk: "Low", adherence: 95,
    location: "Mumbai", phone: "+91 91234 56789", email: "anjali.d@outlook.com", lastVisit: "Apr 28, 2024", 
    vitals: { bp: "118/76 mmHg", sugar: "105 mg/dL", weight: "62kg", heartRate: "72 bpm" },
    doctorsNote: "Blood pressure controlled. Lifestyle: DASH diet. Sodium < 1500mg. Continue Yoga.",
    medications: [
      { name: "Amlodipine Amlokind", dose: "5mg", route: "Oral", frequency: "1x Daily", timing: "Morning" }
    ],
    report: {
      labName: "Metropolis Lab Services",
      reference: "HTN-REF-4412",
      type: "Renal & Electrolyte Panel",
      date: "Apr 10, 2024",
      result: "Normal", status: "Normal",
      sections: [
        {
          group: "Serum Electrolytes",
          tests: [
            { name: "Sodium", val: "138", unit: "mEq/L", range: "135 - 145", flag: "Normal" },
            { name: "Potassium", val: "4.1", unit: "mEq/L", range: "3.5 - 5.1", flag: "Normal" },
            { name: "Chloride", val: "102", unit: "mEq/L", range: "96 - 106", flag: "Normal" }
          ]
        },
        {
          group: "Kidney Markers",
          tests: [
            { name: "Serum Creatinine", val: "0.85", unit: "mg/dL", range: "0.6 - 1.1", flag: "Normal" },
            { name: "BUN (Blood Urea Nitrogen)", val: "14", unit: "mg/dL", range: "7 - 20", flag: "Normal" }
          ]
        }
      ]
    }
  },
  { 
    id: 'VP-103', 
    name: "Vikram Malhotra", 
    age: 68, gender: "Male", condition: "COPD", risk: "Medium", adherence: 78,
    location: "Delhi", phone: "+91 88001 99000", email: "vikram.m@gmail.com", lastVisit: "May 04, 2024", 
    vitals: { bp: "132/84 mmHg", sugar: "110 mg/dL", weight: "71kg", heartRate: "88 bpm" },
    doctorsNote: "SpO2 levels drop during sleep. Lifestyle: Pursed lip breathing. Air purifier in bedroom. Avoid morning walks in winter smog.",
    medications: [
      { name: "Budesonide", dose: "400mcg", route: "Inhalation", frequency: "2x Daily", timing: "12hr intervals" }
    ],
    report: {
      labName: "Max Lab - Pulmonology Unit",
      reference: "ABG-9021",
      type: "Arterial Blood Gas (ABG)",
      date: "May 04, 2024",
      result: "pCO2 48 mmHg", status: "Monitor",
      sections: [
        {
          group: "Blood Gas Analysis",
          tests: [
            { name: "pH (Arterial)", val: "7.34", unit: "", range: "7.35 - 7.45", flag: "Low" },
            { name: "pCO2 (Carbon Dioxide)", val: "48", unit: "mmHg", range: "35 - 45", flag: "High" },
            { name: "pO2 (Oxygen)", val: "72", unit: "mmHg", range: "75 - 100", flag: "Low" },
            { name: "SPO2 (Saturation)", val: "92", unit: "%", range: "95 - 100", flag: "Low" }
          ]
        }
      ]
    }
  }
];

// Seed 30 more patients
for (let i = 4; i <= 30; i++) {
  PATIENTS.push({
    ...PATIENTS[1], id: `VP-1${i}`, name: i % 2 === 0 ? `Kavita ${i} Singh` : `Arjun ${i} Verma`,
    condition: i % 3 === 0 ? "Thyroid" : "Asthma",
    risk: i % 5 === 0 ? "High" : "Low", adherence: 70 + (i % 25),
  });
}

const ADHERENCE_DATA = [ { n: 'Mon', a: 65 }, { n: 'Tue', a: 70 }, { n: 'Wed', a: 68 }, { n: 'Thu', a: 85 }, { n: 'Fri', a: 90 }, { n: 'Sat', a: 92 }, { n: 'Sun', a: 94 } ];
const RISK_DATA = [ { name: 'High', value: 12, color: '#FF3B30' }, { name: 'Med', value: 28, color: '#FF9500' }, { name: 'Low', value: 60, color: '#34C759' } ];

// --- LAB REPORT MODAL (REVAMPED) ---

const LabReportModal = ({ patient, onClose }) => {
  if (!patient || !patient.report) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-12 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 30 }} 
        className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Apple-style Tool Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Diagnostic Report</h3>
            <p className="text-[12px] text-[#86868B] font-medium">{patient.report.type} • {patient.report.reference}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="p-2.5 bg-[#F5F5F7] rounded-full text-[#1D1D1F] hover:bg-gray-200 transition-colors"><Printer size={18} /></button>
            <button onClick={() => window.print()} className="p-2.5 bg-[#F5F5F7] rounded-full text-[#1D1D1F] hover:bg-gray-200 transition-colors"><Download size={18} /></button>
            <button onClick={onClose} className="p-2.5 bg-[#F5F5F7] rounded-full text-[#1D1D1F] hover:bg-gray-200 transition-colors"><X size={18} /></button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-10 overflow-y-auto max-h-[80vh] bg-white print:max-h-none print:p-0">
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tighter text-[#007AFF]">VITALPATH</h1>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Clinical Laboratories Ltd.</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[13px] font-bold text-[#1D1D1F]">Electronic Document</p>
              <p className="text-[11px] font-medium text-[#86868B]">Verified by Digital Signature</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-12 border-y border-gray-50 py-8">
            <div><p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Patient Name</p><p className="font-bold text-[15px]">{patient.name}</p></div>
            <div><p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Visit ID</p><p className="font-bold text-[15px]">{patient.id}</p></div>
            <div><p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Report Date</p><p className="font-bold text-[15px]">{patient.report.date}</p></div>
          </div>

          <div className="space-y-12">
            {patient.report.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4">
                <h4 className="text-[11px] font-black text-[#007AFF] uppercase tracking-[0.1em] border-l-4 border-[#007AFF] pl-3">{section.group}</h4>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left text-[14px]">
                    <thead className="bg-[#FBFBFD] border-b border-gray-100">
                      <tr className="text-[#86868B] font-semibold text-[12px]">
                        <th className="px-6 py-3">Parameter</th>
                        <th className="px-6 py-3 text-center">Result</th>
                        <th className="px-6 py-3 text-center">Unit</th>
                        <th className="px-6 py-3 text-right">Reference Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {section.tests.map((test, tIdx) => (
                        <tr key={tIdx} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[#1D1D1F]">{test.name}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`font-bold text-[15px] ${test.flag === 'Normal' ? 'text-slate-900' : 'text-[#FF3B30]'}`}>{test.val}</span>
                              {test.flag !== 'Normal' && <span className="text-[9px] font-black uppercase text-[#FF3B30] tracking-wider">{test.flag}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-[#86868B] font-medium">{test.unit || '--'}</td>
                          <td className="px-6 py-4 text-right font-mono text-[12px] text-[#86868B]">{test.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-50 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[12px] font-bold text-[#1D1D1F]">Electronically Signed</p>
              <p className="text-[11px] font-medium text-[#86868B]">Dr. S. Malhotra, MD (Pathology)</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">End of Report</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- CORE UI COMPONENTS ---

const Sidebar = () => {
  const loc = useLocation();
  const items = [{ icon: <LayoutDashboard size={18} />, label: "Overview", path: "/" }, { icon: <Users size={18} />, label: "Patients", path: "/patients" }];
  return (
    <aside className="w-64 bg-[#F5F5F7] border-r border-gray-200 p-8 flex flex-col fixed h-full select-none">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-[#007AFF] rounded-[11px] flex items-center justify-center shadow-sm"><ShieldCheck className="text-white" size={20} /></div>
        <h1 className="text-[18px] font-bold tracking-tight">VitalPath</h1>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map(i => (
          <Link key={i.label} to={i.path} className="no-underline">
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${loc.pathname === i.path ? 'bg-white text-[#007AFF] shadow-sm font-semibold' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}>
              {i.icon} <span className="text-[14px]">{i.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

const Overview = () => {
  const nav = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl pb-20">
      <header className="flex justify-between items-end mb-10 text-left">
        <div><p className="text-[14px] font-semibold text-[#86868B] mb-1">Thursday, May 07</p><h2 className="text-3xl font-bold tracking-tight">Command Center</h2></div>
        <div className="bg-white border border-gray-200 rounded-full px-5 py-2 flex items-center gap-3 text-[13px] font-bold shadow-sm">
          <div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse"></div> Clinical Engine Active
        </div>
      </header>

      <div className="grid grid-cols-4 gap-6 mb-10 text-left">
        <StatCard title="Adherence" val="88.4%" change="+2.4%" />
        <StatCard title="High Risk" val="04" change="-1" color="text-[#FF3B30]" />
        <StatCard title="Active Plans" val="1,240" change="+12" />
        <StatCard title="Today's Visits" val="18" change="In Queue" color="text-[#007AFF]" />
      </div>

      <div className="grid grid-cols-12 gap-8 text-left">
        <div className="col-span-8 bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm">
           <h3 className="text-[18px] font-bold mb-8">System Compliance Trend</h3>
           <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={ADHERENCE_DATA}><defs><linearGradient id="appleBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#007AFF" stopOpacity={0.1}/><stop offset="95%" stopColor="#007AFF" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: '#86868B', fontSize: 12}} dy={10} /><YAxis hide /><Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.06)'}} /><Area type="monotone" dataKey="a" stroke="#007AFF" strokeWidth={3} fill="url(#appleBlue)" /></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="col-span-4 bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm">
          <h3 className="text-[17px] font-bold mb-6">Patient Segmentation</h3>
          <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={RISK_DATA} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>{RISK_DATA.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}</Pie></PieChart></ResponsiveContainer></div>
          <div className="mt-6 space-y-3">{RISK_DATA.map(r => (<div key={r.name} className="flex justify-between text-[13px] font-bold text-[#86868B]"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: r.color}}></div> {r.name}</div><span className="text-[#1D1D1F]">{r.value}%</span></div>))}</div>
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
        <h2 className="text-3xl font-bold tracking-tight">Patient Directory</h2>
        <div className="relative">
          <Search className="absolute left-4 top-3 text-[#86868B]" size={18} />
          <input type="text" placeholder="Search by name or condition..." className="pl-11 pr-6 py-2.5 bg-[#E8E8ED] rounded-full w-80 text-[14px] outline-none focus:bg-white transition-all font-medium" onChange={e => setQ(e.target.value)} />
        </div>
      </div>
      <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FBFBFD] text-[11px] font-bold uppercase tracking-widest text-[#86868B] border-b border-gray-100">
            <tr><th className="px-8 py-4">Identity</th><th className="px-8 py-4">Clinical Status</th><th className="px-8 py-4">Risk</th><th className="px-8 py-4 text-right">Access</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[14px]">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                <td className="px-8 py-5 font-bold text-[#1D1D1F]">{p.name}<p className="text-[12px] text-[#86868B] font-medium">{p.id}</p></td>
                <td className="px-8 py-5 font-semibold text-slate-600">{p.condition}</td>
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
        <button onClick={() => nav('/patients')} className="flex items-center gap-2 text-[#007AFF] font-bold text-[14px] mb-8 hover:translate-x-[-3px] transition-transform"><ChevronLeft size={18} /> All Patients</button>
        <div className="grid grid-cols-12 gap-8 text-left">
          <div className="col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-[22px] font-bold text-[#86868B] mb-6">{p.name.charAt(0)}</div>
              <h2 className="text-2xl font-bold tracking-tight">{p.name}</h2>
              <p className="text-[14px] text-[#86868B] font-bold mb-8">{p.id} • {p.age}Y • {p.gender}</p>
              <div className="space-y-4 text-[13px] font-bold text-slate-600">
                <div className="flex items-center gap-3"><Phone size={16} className="text-[#86868B]" /> {p.phone}</div>
                <div className="flex items-center gap-3"><Mail size={16} className="text-[#86868B]" /> {p.email}</div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-[#86868B]" /> {p.location}</div>
                <div className="flex items-center gap-3"><Calendar size={16} className="text-[#86868B]" /> Last Visit: {p.lastVisit}</div>
              </div>
            </div>
            <div className="bg-[#007AFF] p-8 rounded-[30px] text-white shadow-xl shadow-blue-100">
               <p className="text-[11px] font-bold opacity-60 uppercase tracking-widest">Compliance</p>
               <h4 className="text-5xl font-bold tracking-tighter mt-1">{p.adherence}%</h4>
               <div className="mt-6 flex items-start gap-2 bg-white/10 p-4 rounded-xl text-[12px] font-medium"><Info size={14} className="shrink-0 mt-0.5" /> Clinical Insight: High risk of complication due to medication non-compliance.</div>
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
                <div className="flex items-center gap-2 mb-4 text-[#FF9500] font-bold uppercase text-[11px] tracking-wider"><Stethoscope size={16} /> Clinical Directives</div>
                <p className="text-[14px] font-semibold leading-relaxed text-slate-700 bg-orange-50/40 p-6 rounded-2xl border border-orange-100/30">{p.doctorsNote}</p>
             </div>

             <div className="bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm">
                <h4 className="text-[17px] font-bold mb-8">Medication Regimen</h4>
                <div className="space-y-4">{p.medications.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#FBFBFD] rounded-2xl">
                    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"><Pill size={18} className="text-[#007AFF]" /></div><div><p className="font-bold text-[15px]">{m.name} {m.dose}</p><p className="text-[12px] text-[#86868B] font-bold">{m.route} • {m.frequency}</p></div></div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600"><Clock size={14} /> {m.timing}</div>
                  </div>
                ))}</div>
             </div>

             <div className="bg-white p-8 rounded-[30px] border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h4 className="text-[17px] font-bold tracking-tight">Diagnostics</h4>
                   <button onClick={() => setShow(true)} className="flex items-center gap-2 text-[#007AFF] text-[12px] font-bold bg-[#007AFF]/5 px-4 py-2 rounded-full hover:bg-[#007AFF]/10 transition-all"><FileText size={16} /> Full Report</button>
                </div>
                <div className="bg-[#1D1D1F] p-6 rounded-[24px] flex justify-between items-center shadow-lg">
                   <div><p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Test Panel</p><p className="text-[16px] font-bold text-white mt-1">{p.report.type}</p></div>
                   <div><p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Primary Value</p><p className="text-[20px] font-bold text-blue-400 mt-1">{p.report.result}</p></div>
                   <div className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase text-white ${p.report.status === 'Normal' ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`}>{p.report.status}</div>
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
