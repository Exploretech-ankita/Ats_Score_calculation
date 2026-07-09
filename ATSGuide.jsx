import "./ATSGuide.css";

export default function ATSGuide() {
  const atsFactors = [
    {
      title: "Keyword Matching",
      text: "ATS checks whether important skills, technologies, certifications, and job-related keywords appear in your resume.",
    },
    {
      title: "Job Relevance",
      text: "The system compares your experience and qualifications against the specific job description.",
    },
    {
      title: "Resume Structure",
      text: "ATS prefers clean layouts with clear headings, standard fonts, and readable formatting.",
    },
    {
      title: "Skills Alignment",
      text: "Technical and soft skills that match employer requirements significantly increase your score.",
    },
  ];

  const improvements = [
    {
      title: "Use Job Description Keywords",
      text: "Include relevant skills, tools, and certifications found in the target job posting.",
    },
    {
      title: "Add Quantifiable Achievements",
      text: "Use metrics such as percentages, revenue growth, project impact, or productivity improvements.",
    },
    {
      title: "Improve Skills Section",
      text: "List both technical and soft skills that match employer requirements.",
    },
    {
      title: "Use ATS-Friendly Formatting",
      text: "Avoid tables, graphics, text boxes, and unusual fonts that ATS software may fail to parse.",
    },
    {
      title: "Tailor Every Resume",
      text: "Customize your resume for each application instead of using one generic version.",
    },
  ];

  const breakdown = [
    { label: "Keywords", value: "40%" },
    { label: "Experience Match", value: "30%" },
    { label: "Skills Match", value: "20%" },
    { label: "Formatting", value: "10%" },
  ];

  return (
    <div className="ats-page">
      <div className="bg-glow">
        <div className="glow glow1"></div>
        <div className="glow glow2"></div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>
            Understand Your{" "}
            <span className="gradient-text">ATS Score</span>
          </h1>

          <p>
            Most companies use Applicant Tracking Systems (ATS) to scan
            resumes before a recruiter sees them. Your ATS score reflects
            how well your resume matches a job description.
          </p>
        </div>
      </section>

      {/* How ATS Works */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">How ATS Scoring Works</h2>

          <div className="grid">
            {atsFactors.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score */}
      <section className="section score-section">
        <div className="container">
          <h2 className="section-title">Example ATS Score</h2>

          <div className="score-circle">
            <div className="inner-circle">
              <h2>75%</h2>
              <span>Good Match</span>
            </div>
          </div>

          <p className="score-description">
            A score above 70% is generally considered competitive.
            Scores above 85% indicate strong alignment with the job.
          </p>
        </div>
      </section>

      {/* Improvement */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            How To Improve Your ATS Score
          </h2>

          <div className="steps">
            {improvements.map((item, index) => (
              <div className="step" key={item.title}>
                <h3>
                  {index + 1}. {item.title}
                </h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakdown */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">ATS Score Breakdown</h2>

          <div className="grid">
            {breakdown.map((item) => (
              <div className="card" key={item.label}>
                <h3>{item.label}</h3>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        ATS Resume Optimization Guide © 2026
      </footer>
    </div>
  );
}