import { useState, useCallback, useRef } from "react";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import { Link , useNavigate} from "react-router-dom";
import Multistepform from "./form";
import "./dashboard.css";

// ============================================================
// CONTEXT — Global state for auth, resume, analytics
// ============================================================


import { createContext, useContext } from "react";
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ============================================================
// AI SUGGESTIONS ENGINE — Calls Claude API
// ============================================================



// ============================================================
// ICON COMPONENTS — Lightweight inline SVG icons
// ============================================================

const icons = {
  star:         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  zap:          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  award:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  briefcase:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  target:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  "trending-up":<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  upload:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  download:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  trash:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  check:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  x:            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  menu:         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  home:         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  file:         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  chart:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  settings:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

const Icon = ({ name }) => {
  const el = icons[name];
  if (!el) return null;
  return <span className="icon" aria-hidden="true">{el}</span>;
};

// ============================================================
// SKELETON LOADER
// ============================================================
const Skeleton = ({ w = "100%", h = 16 }) => (
  <div className="skeleton" style={{ width: w, height: h }} />
);

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ label, value, sub, accent = "#a78bfa", loading }) => (
  <div
    className="stat-card"
    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${accent}22`; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; }}
  >
    <p className="stat-card__label">{label}</p>
    {loading
      ? <Skeleton h={32} w="60%" />
      : <p className="stat-card__value">{value}</p>
    }
    {sub && !loading && (
      <p className="stat-card__sub" style={{ color: accent }}>{sub}</p>
    )}
  </div>
);

// ============================================================
// NAVBAR
// ============================================================
const Navbar = ({ user, onMenuToggle }) => (
  <nav className="navbar">
    <div className="navbar-left">
      <button className="navbar-menu-btn" onClick={onMenuToggle}>
        <Icon name="menu" />
      </button>
      <div className="navbar-logo">
        <div className="navbar-logo-icon">
          <span>A</span>
        </div>
        <span className="navbar-logo-name">ATSPro</span>
      </div>
    </div>

    <div className="navbar-right">
      {user && (
        <>
          <span className="navbar-plan-badge">{user.plan}</span>
          <div className="navbar-user">
            <div className="navbar-avatar">{user.initials}</div>
          </div>
        </>
      )}
    </div>
  </nav>
);

// ============================================================
// SIDEBAR
// ============================================================
const navItems = [
  { icon: "home",     label: "Dashboard", id: "dashboard" },
  { icon: "file",     label: "Make your own Resume", path:"/Multistepform", id:"Resume"},
  { icon: "settings", label: "Settings",  id: "settings",
    children: [
      { label: "Profile", id: "profile", path:"/AccountPage" },
      { label: "How to improve ATS score", id: "ATS_Score_INFO" , path:"/ATSGuide"},
    ]
   },
];

const Sidebar = ({ open, activeTab, onTabChange, user }) => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <aside className={`sidebar ${open ? "sidebar--open" : "sidebar--closed"}`}>
      {user && open && (
        <div className="sidebar-user-card">
          <div className="sidebar-user-inner">
            <div className="sidebar-avatar">{user.initials}</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user.name}</p>
              <p className="sidebar-user-email">{user.email}</p>
            </div>
          </div>
        </div>
      )}

     {open &&
  navItems.map(item => (
    <div key={item.id}>
      <button
        onClick={() => {
          if (item.children) {
            setSettingsOpen(!settingsOpen);
          } else if (item.path) {
            navigate(item.path);
          } else {
            onTabChange(item.id);
          }
        }}
        className={`sidebar-nav-btn ${
          activeTab === item.id ? "sidebar-nav-btn--active" : ""
        }`}
      >
        <Icon name={item.icon} />
        <span>{item.label}</span>

        {item.children && (
          <span style={{ marginLeft: "auto" }}>
            {settingsOpen ? "▲" : "▼"}
          </span>
        )}
      </button>

      {item.children && settingsOpen && (
        <div className="sidebar-dropdown">
          {item.children.map(child => (
            <button
              key={child.id}
              className="sidebar-dropdown-btn"
              onClick={() =>  {        
             if (child.path)
            {
                navigate(child.path);
            } 
            else
           {
                onTabChange(child.id);
           } 
          }}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  ))}
    </aside>
  );
};
// ============================================================
// UPLOAD ZONE
// ============================================================
const UploadZone = ({ onParsed }) => {
  const [drag, setDrag]         = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState(null);
  const inputRef                = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => setProgress(p => {
      if (p >= 90) { clearInterval(interval); return 90; }
      return p + 12;
    }), 180);

    const formData = new FormData();
    formData.append("resume", file);
    const response = await fetch("http://localhost:5000/api/parse-resume", { method: "POST", body: formData });
   if (!response.ok) {
  throw new Error("Resume parsing failed");
}

const parsed = await response.json();

console.log("Backend response:", parsed);

    clearInterval(interval);
    setProgress(100);
    setTimeout(() => { setUploading(false); onParsed(parsed); }, 400);



  };

  return (
    <div className="upload-zone-wrapper">
      <div
        className={`upload-dropzone ${drag ? "upload-dropzone--drag" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])}
        />
        <div className="upload-dropzone-icon"><Icon name="upload" /></div>
        <p className="upload-dropzone-title">Drop your resume here</p>
        <p className="upload-dropzone-sub">PDF or DOCX · Instant ATS analysis</p>
      </div>

      {uploading && (
        <div className="upload-progress-wrapper">
          <div className="upload-progress-row">
            <span className="upload-filename">{fileName}</span>
            <span className="upload-pct">{progress}%</span>
          </div>
          <div className="upload-progress-track">
            <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ATS SCORE RING
// ============================================================
const ScoreRing = ({ score }) => {
  const r            = 52;
  const circumference = 2 * Math.PI * r;
  const offset       = circumference - (score / 100) * circumference;
  const color        = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="score-ring-wrapper">
      <svg width="130" height="130" viewBox="0 0 130 130" aria-label={`ATS Score: ${score}`} role="img">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="65" y="62" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="'Space Grotesk', sans-serif">{score}</text>
        <text x="65" y="78" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">ATS SCORE</text>
      </svg>
      <span style={{
        fontSize: 11, padding: "3px 10px", borderRadius: 20,
        background: `${color}22`, color, fontWeight: 600, border: `1px solid ${color}44`,
      }}>
        {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"}
      </span>
    </div>
  );
};

// ============================================================
// SKILLS PANEL
// ============================================================
const barColors = ["#7c3aed","#6d28d9","#5b21b6","#4c1d95","#a78bfa","#8b5cf6","#c4b5fd"];

const SkillsPanel = ({ skills, missingKeywords }) => (
  <div className="panel-card">
    <h3 className="panel-title">Skills Analysis</h3>

    <div className="skills-list">
      {skills.slice(0, 6).map((s, i) => (
        <div key={s.name}>
          <div className="skill-item-row">
            <span className="skill-item-name">{s.name}</span>
            <span className="skill-item-score" style={{ color: barColors[i % barColors.length] }}>{s.score}%</span>
          </div>
          <div className="skill-bar-track">
            <div
              className="skill-bar-fill"
              style={{ width: `${s.score}%`, background: barColors[i % barColors.length] }}
            />
          </div>
        </div>
      ))}
    </div>

    {missingKeywords?.length > 0 && (
      <>
        <p className="missing-keywords-label">Missing Keywords</p>
        <div className="missing-keywords-list">
          {missingKeywords.map(kw => (
            <span key={kw} className="missing-keyword-tag">{kw}</span>
          ))}
        </div>
      </>
    )}
  </div>
);

// ============================================================
// AI SUGGESTIONS PANEL
// ============================================================
const priorityColor = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };


// ============================================================
// RESUME TABLE
// ============================================================
const scoreColor = s => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";

const ResumeTable = ({ resumes, loading, onDelete }) => (
  <div className="table-card">
    <h3 className="table-card-title">Recent Resumes</h3>

    {loading ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3].map(i => <Skeleton key={i} h={44} />)}
      </div>
    ) : (
      <table className="resume-table">
        <thead>
          <tr>
            {["Resume", "Role", "ATS Score", "Updated", "Actions"].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resumes.map((r, i) => (
            <tr
              key={r.id}
              className={i < resumes.length - 1 ? "resume-table-row--bordered" : ""}
            >
              <td>
                <p className="resume-cell-name">{r.name}</p>
                <p className="resume-cell-downloads">{r.downloads} downloads</p>
              </td>
              <td className="resume-cell-role">{r.role}</td>
              <td>
                <span
                  className="resume-score-badge"
                  style={{
                    color: scoreColor(r.atsScore),
                    background: `${scoreColor(r.atsScore)}15`,
                    border: `1px solid ${scoreColor(r.atsScore)}30`,
                  }}
                >
                  {r.atsScore}
                </span>
              </td>
              <td className="resume-cell-date">{r.updated}</td>
              <td>
                <div className="resume-actions">
                  <button className="btn-download">
                    <Icon name="download" /> Download
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(r.id)}>
                    <Icon name="trash" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

// ============================================================
// ATS HISTORY CHART
// ============================================================
const ATSHistoryChart = ({ data, growth }) => (
  <div className="chart-card">
    <div className="chart-card-header">
      <h3 className="chart-card-title">ATS Score History</h3>
      {growth && (
        <span className="chart-growth-badge">↑ +{growth}% this month</span>
      )}
    </div>
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[30, 100]} />
        <Tooltip contentStyle={{ background: "#1a1033", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, fontSize: 12, color: "#fff" }} />
        <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// ============================================================
// PROJECTS + CERTS PANEL
// ============================================================
const ProjectsCertsPanel = ({ projects, certifications }) => (
  <div className="proj-cert-grid">
    <div className="proj-cert-card">
      <h3 className="proj-cert-title">Projects</h3>
      {projects.map(p => (
        <div key={p} className="proj-item">
          <div className="proj-dot" />
          <span className="proj-name">{p}</span>
        </div>
      ))}
    </div>
    <div className="proj-cert-card">
      <h3 className="proj-cert-title">Certifications</h3>
      {certifications.map(c => (
        <div key={c} className="cert-item">
          <span className="cert-star">★</span>
          <span className="cert-name">{c}</span>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// COMPLETION BAR
// ============================================================
const CompletionBar = ({ pct }) => (
  <div className="completion-card">
    <div className="completion-header">
      <h3 className="completion-title">Resume Completion</h3>
      <span className="completion-pct">{pct}%</span>
    </div>
    <div className="completion-track">
      <div className="completion-fill" style={{ width: `${pct}%` }} />
    </div>
    <p className="completion-hint">
      {pct >= 90
        ? "Almost perfect — add portfolio links to hit 100%"
        : pct >= 70
        ? "Good progress — add certifications to boost score"
        : "Add more sections to improve your ATS ranking"}
    </p>
  </div>
);

// ============================================================
// EMPTY STATE
// ============================================================
const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-state-emoji">📄</div>
    <p className="empty-state-title">No resume analyzed yet</p>
    <p className="empty-state-body">Upload a resume above to get your ATS score, skill analysis, and AI suggestions.</p>
  </div>
);

// ============================================================
// MAIN APP
// ============================================================
export default function App() {

  const [user] = useState(null);

  const [resumes, setResumes] = useState([]);

  const [analytics] = useState(null);

  const [parsedResume, setParsedResume] = useState(null);

  const [aiSuggestions, setAiSuggestions] = useState([]);

  const [aiLoading, setAiLoading] = useState(false);

  const [loadingResumes] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");



  const handleParsed = useCallback(async (data) => {


    console.log("Received resume data:", data);



    const safeData = {

      fileName: data.fileName ?? "resume.pdf",

      atsScore: Number(data.atsScore ?? 0),


      role: data.role ?? "Unknown",


      skills: Array.isArray(data.skills)
        ? data.skills
        : [],


      missingKeywords: Array.isArray(data.missingKeywords)
        ? data.missingKeywords
        : [],


      projects: Array.isArray(data.projects)
        ? data.projects
        : [],


      certifications: Array.isArray(data.certifications)
        ? data.certifications
        : [],


      experience: data.experience ?? "Not available",


      education: data.education ?? "Not available",


      resumeCompletion: Number(data.resumeCompletion ?? 0)

    };



    setParsedResume(safeData);
    setResumes(prev => [

      {

        id: Date.now(),

        name: safeData.fileName,

        atsScore: safeData.atsScore,

        role: safeData.role,

        updated:"Just now",

        downloads:0

      },

      ...prev

    ]);



  }, []);





  const handleDelete = useCallback(

    (id)=>{

      setResumes(prev =>
        prev.filter(r=>r.id!==id)
      );

    },

    []

  );





  const avgATS = resumes.length

    ? Math.round(
        resumes.reduce(
          (sum,r)=>sum+r.atsScore,
          0
        ) / resumes.length
      )

    : 0;



  const totalDownloads = resumes.reduce(

    (sum,r)=>sum+(r.downloads || 0),

    0

  );





  const skillData = parsedResume

    ? parsedResume.skills.map((skill,index)=>{


        if(typeof skill === "object"){

          return {

            name: skill.name ?? "Unknown",

            score: skill.score ?? (90-index*8),

            demand: skill.demand ?? "Medium"

          }

        }


        return {

          name:skill,

          score:90-index*8,

          demand:"Medium"

        }


      })

    : [];






  return (

<div className="app-root">


<div className="app-bg-glow">

<div className="app-bg-glow-top" />

<div className="app-bg-glow-bottom" />

</div>



<div className="app-inner">



<Navbar

user={user}

onMenuToggle={()=>setSidebarOpen(v=>!v)}

sidebarOpen={sidebarOpen}

/>



<div className="app-body">


<Sidebar

open={sidebarOpen}

activeTab={activeTab}

onTabChange={setActiveTab}

user={user}

/>



<main className="main-content">



<div className="page-header">


<h1 className="page-title">

{user
? `Welcome back, ${user.name.split(" ")[0]} 👋`
: "Dashboard"}

</h1>



<p className="page-subtitle">

{

parsedResume

?

`Analyzing: ${parsedResume.role} • ATS Score: ${parsedResume.atsScore}`

:

"Upload your resume to get a full ATS analysis"

}


</p>


</div>





<div className="stat-cards-grid">


<StatCard

label="Avg ATS Score"

value={avgATS || "--"}

sub={
avgATS>=80
?"Excellent"
:avgATS>0
?"Room to improve"
:"Upload a resume"
}

accent="#22c55e"

loading={loadingResumes}

/>




<StatCard

label="Total Downloads"

value={totalDownloads}

sub="Across all resumes"

accent="#60a5fa"

loading={loadingResumes}

/>




<StatCard

label="Top Skill"

value={
skillData.length
?
skillData[0].name
:
"--"
}

sub={
parsedResume
?
`+${skillData[0]?.score ?? 0}% match`
:
"Pending analysis"
}

accent="#f59e0b"

loading={false}

/>


</div>





<UploadZone onParsed={handleParsed}/>





{

parsedResume ? (


<>



<div className="ats-overview-grid">


<div className="ats-score-card">


<ScoreRing score={parsedResume.atsScore}/>


<div className="ats-score-role">


<p className="ats-score-role-name">

{parsedResume.role}

</p>


<p className="ats-score-role-label">

Detected role

</p>


</div>


</div>





<div className="ats-details-col">


<CompletionBar pct={parsedResume.resumeCompletion}/>



<div className="resume-details-card">


<p className="resume-details-heading">

Resume Details

</p>



<div className="resume-details-grid">


<div>

<p className="resume-detail-key">
Experience
</p>

<p className="resume-detail-val">
{parsedResume.experience}
</p>

</div>



<div>

<p className="resume-detail-key">
Education
</p>

<p className="resume-detail-val">
{parsedResume.education}
</p>

</div>




<div>

<p className="resume-detail-key">
Projects
</p>

<p className="resume-detail-val">

{parsedResume.projects.length} listed

</p>

</div>





<div>

<p className="resume-detail-key">
Certifications
</p>

<p className="resume-detail-val">

{parsedResume.certifications.length} listed

</p>

</div>


</div>


</div>



</div>


</div>






<div className="two-col-grid">


<SkillsPanel

skills={skillData}

missingKeywords={parsedResume.missingKeywords}

/>






</div>







<ProjectsCertsPanel

projects={parsedResume.projects}

certifications={parsedResume.certifications}

/>





{analytics &&

<ATSHistoryChart

data={analytics.atsHistory}

growth={analytics.monthlyGrowth}

/>

}





</>


)

:

<EmptyState/>

}





<ResumeTable

resumes={resumes}

loading={loadingResumes}

onDelete={handleDelete}

/>




</main>


</div>


</div>


</div>


);

}
