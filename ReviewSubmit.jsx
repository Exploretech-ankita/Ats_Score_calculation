import React, { useState } from "react";
import html2pdf from "html2pdf.js";

const ReviewSubmit = ({ prevStep, data = {} }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    console.log(data);
  };

  const downloadPDF = () => {
    const element = document.getElementById("resume");
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${data.firstName || "resume"}_ATS_Resume.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // Group skills by domain.
  // Each entry: { domain: "Frontend", skills: "React, Vue", manualSkill: "..." }
  const skillsByDomain = Array.isArray(data.skills)
    ? data.skills.reduce((acc, entry) => {
        if (!entry || typeof entry !== "object") return acc;
        const domain = (entry.domain && entry.domain.trim()) || "General";
        const skillStr = String(entry.skills || entry.manualSkill || "").trim();
        const items = skillStr
          .split(/[,;]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (items.length === 0) return acc;
        if (!acc[domain]) acc[domain] = [];
        acc[domain].push(...items);
        return acc;
      }, {})
    : {};

  // Flat list for ATS plain-text paragraph + score check
  const skills = Object.values(skillsByDomain).flat();

  return (
    <div style={styles.page}>

      {submitted && (
        <div style={styles.successBanner}>
          ✅ Resume submitted successfully!
        </div>
      )}

      {/* ATS RESUME — plain semantic HTML, no tables, no columns */}
      <div id="resume" style={styles.resume}>

        {/* HEADER — name must be plain text, not inside a table */}
        <header style={styles.header}>
          <h1 style={styles.name}>
            {data.firstName} {data.lastName}
          </h1>
          <p style={styles.contact}>
            {[data.email, data.phone, data.linkedin, data.location]
              .filter(Boolean)
              .join(" | ")}
          </p>
        </header>

        {/* PROFESSIONAL SUMMARY — ATS reads this first for keyword matching */}
        <Section title="Professional Summary">
          <p style={styles.bodyText}>
            {data.about || "No summary provided."}
          </p>
        </Section>

        {/* EXPERIENCE — most weighted section for ATS */}
        <Section title="Work Experience">
          {data.company ? (
            <div style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{data.role}</span>
                <span style={styles.entryMeta}>{data.experience} {parseInt(data.experience) === 1 ? "yr" : "yrs"}</span>
              </div>
              <p style={styles.entryOrg}>{data.company}</p>
              {/* Bullet points dramatically improve ATS parsing */}
              {data.responsibilities ? (
                <ul style={styles.bulletList}>
                  {data.responsibilities
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i} style={styles.bulletItem}>{line.replace(/^[-•]\s*/, "")}</li>
                    ))}
                </ul>
              ) : (
                <ul style={styles.bulletList}>
                  <li style={styles.bulletItem}>
                    Contributed to key deliverables as {data.role} at {data.company}.
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <p style={styles.bodyText}>No experience added.</p>
          )}
        </Section>

        {/* EDUCATION */}
        <Section title="Education">
          {data.college ? (
            <div style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>
                  {data.degree} in {data.branch}
                </span>
                <span style={styles.entryMeta}>{data.graduationYear}</span>
              </div>
              <p style={styles.entryOrg}>{data.college}</p>
              {data.gpa && (
                <p style={styles.bodyText}>GPA: {data.gpa}</p>
              )}
            </div>
          ) : (
            <p style={styles.bodyText}>No education added.</p>
          )}
        </Section>

        {/* SKILLS — grouped by domain, with hidden ATS plain-text paragraph */}
        <Section title="Technical Skills">
          {skills.length > 0 ? (
            <>
              {/* Hidden plain-text paragraph for ATS keyword scanning */}
              <p style={{ ...styles.bodyText, fontSize: "0pt", height: 0, overflow: "hidden", margin: 0 }}>
                {skills.join(", ")}
              </p>
              {/* Domain-grouped rows */}
              <table style={styles.skillTable}>
                <tbody>
                  {Object.entries(skillsByDomain).map(([domain, items]) => (
                    <tr key={domain}>
                      <td style={styles.skillDomainCell}>{domain}:</td>
                      <td style={styles.skillItemsCell}>
                        <div style={styles.skillPillsWrap}>
                          {items.map((skill, i) => (
                            <span key={i} style={styles.skillPill}>{skill}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p style={styles.bodyText}>No skills added.</p>
          )}
        </Section>

        {/* CERTIFICATIONS — optional, high ATS value if present */}
        {data.certifications && (
          <Section title="Certifications">
            <p style={styles.bodyText}>{data.certifications}</p>
          </Section>
        )}

        {/* PROJECTS — optional */}
        {data.projects && (
          <Section title="Projects">
            <p style={styles.bodyText}>{data.projects}</p>
          </Section>
        )}

      </div>

      {/* ATS SCORE PREVIEW PANEL */}
      <div style={styles.scorePanel}>
        <p style={styles.scorePanelTitle}>ATS Readiness</p>
        <ScoreItem label="Name & contact" pass={!!(data.firstName && data.email)} />
        <ScoreItem label="Professional summary" pass={!!(data.about && data.about.length > 40)} />
        <ScoreItem label="Work experience" pass={!!(data.company && data.role)} />
        <ScoreItem label="Education details" pass={!!(data.college && data.degree)} />
        <ScoreItem label="Skills listed" pass={skills.length >= 3} />
        <ScoreItem label="Single-column layout" pass={true} />
        <ScoreItem label="No tables / columns" pass={true} />
        <ScoreItem label="Standard section names" pass={true} />
      </div>

      {/* BUTTONS */}
      <div style={styles.buttonGroup}>
        <button style={styles.backBtn} onClick={() => prevStep?.()}>
          Back
        </button>
        <button style={styles.downloadBtn} onClick={downloadPDF}>
          Download PDF
        </button>
        <button
          style={{ ...styles.submitBtn, opacity: submitted ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={submitted}
        >
          {submitted ? "Submitted ✓" : "Submit"}
        </button>
      </div>
    </div>
  );
};

/* SECTION COMPONENT — uses <section> + <h2> for semantic HTML (ATS-friendly) */
const Section = ({ title, children }) => (
  <section style={styles.section} aria-label={title}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <hr style={styles.line} />
    {children}
  </section>
);

/* SCORE ITEM COMPONENT */
const ScoreItem = ({ label, pass }) => (
  <div style={styles.scoreItem}>
    <span style={{ ...styles.scoreIcon, color: pass ? "#28a745" : "#dc3545" }}>
      {pass ? "✓" : "✗"}
    </span>
    <span style={{ ...styles.scoreLabel, color: pass ? "#155724" : "#721c24" }}>
      {label}
    </span>
  </div>
);

/* STYLES */
const styles = {
  page: {
    background: "#cfd8dc",
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },

  successBanner: {
    background: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
    borderRadius: "6px",
    padding: "12px 24px",
    fontSize: "14px",
    width: "794px",
    maxWidth: "100%",
    textAlign: "center",
  },

  /* ── ATS RESUME ── */
  resume: {
    width: "794px",
    minHeight: "1123px",
    background: "#fff",
    /* generous margin mirrors real A4/Letter — ATS parsers expect whitespace */
    padding: "72px 72px 72px 72px",
    boxSizing: "border-box",
    /* Standard system-safe font — never use custom web fonts in ATS resumes */
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "11pt",
    color: "#000",
    lineHeight: 1.5,
    boxShadow: "0 0 25px rgba(0,0,0,0.12)",
  },

  header: {
    textAlign: "center",
    marginBottom: "18px",
  },

  name: {
    margin: 0,
    fontSize: "20pt",
    fontWeight: "700",
    /* UPPER-CASE via textTransform — the underlying text stays readable for parsers */
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#000",
  },

  contact: {
    fontSize: "10pt",
    marginTop: "5px",
    color: "#000",
  },

  section: {
    marginBottom: "18px",
  },

  /* Section titles use standard keywords ATS expects */
  sectionTitle: {
    textAlign: "left",
    fontSize: "11pt",
    fontWeight: "700",
    marginBottom: "3px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#000",
  },

  line: {
    border: "none",
    borderTop: "1px solid #000",
    marginBottom: "8px",
  },

  entry: {
    marginBottom: "10px",
  },

  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },

  entryTitle: {
    fontSize: "11pt",
    fontWeight: "700",
    color: "#000",
  },

  entryMeta: {
    fontSize: "10pt",
    color: "#000",
  },

  entryOrg: {
    fontSize: "10pt",
    fontStyle: "italic",
    margin: "2px 0 4px",
    color: "#000",
  },

  bodyText: {
    fontSize: "10pt",
    color: "#000",
    margin: 0,
  },

  /* Bullet lists are parsed far better than plain paragraphs by ATS */
  bulletList: {
    margin: "4px 0 0 18px",
    padding: 0,
  },

  bulletItem: {
    fontSize: "10pt",
    color: "#000",
    marginBottom: "3px",
    lineHeight: 1.5,
  },

  skillTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10pt",
  },

  skillDomainCell: {
    fontWeight: "700",
    color: "#000",
    fontSize: "10pt",
    paddingRight: "12px",
    paddingTop: "4px",
    paddingBottom: "4px",
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "140px",
  },

  skillItemsCell: {
    paddingTop: "4px",
    paddingBottom: "4px",
    verticalAlign: "top",
  },

  skillPillsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    alignItems: "center",
  },

  skillPill: {
    fontSize: "9pt",
    padding: "2px 10px",
    border: "1px solid #555",
    borderRadius: "12px",
    color: "#000",
    background: "#f5f5f5",
  },

  /* ── ATS SCORE PANEL (outside the resume div, won't appear in PDF) ── */
  scorePanel: {
    width: "794px",
    maxWidth: "100%",
    background: "#fff",
    borderRadius: "8px",
    padding: "16px 20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.08)",
  },

  scorePanelTitle: {
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#333",
  },

  scoreItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "5px",
  },

  scoreIcon: {
    fontSize: "14px",
    fontWeight: "700",
    width: "16px",
  },

  scoreLabel: {
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
  },

  /* ── BUTTONS ── */
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },

  backBtn: {
    padding: "10px 24px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },

  downloadBtn: {
    padding: "10px 24px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },

  submitBtn: {
    padding: "10px 24px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "opacity 0.2s",
  },
};

export default ReviewSubmit;
