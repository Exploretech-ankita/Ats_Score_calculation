import React, { useState } from "react";
import "./skillsInfo.css";

const DOMAIN_SKILLS = {
  "AI/ML": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"],
  "Web Development": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express"],
  "App Development": ["Flutter", "Dart", "Kotlin", "React Native", "Firebase"],
  "Data Science": ["Python", "Pandas", "NumPy", "SQL"],
  "Cyber Security": ["Ethical Hacking", "Linux", "Network Security"],
  "Cloud Computing": ["AWS", "Docker", "Kubernetes"],
  "DevOps": ["CI/CD", "Jenkins", "GitHub Actions"],
  "UI/UX Design": ["Figma", "Wireframing", "Prototyping"],
  "Blockchain": ["Solidity", "Smart Contracts", "Web3"]
};

const SkillsInfo = ({ nextStep, prevStep, updateData, data }) => {

  const [skills, setSkills] = useState(
    data.skills || [
      {
        domain: "",
        customDomain: "",
        skills: [],
        manualSkill: "",
        url: ""
      }
    ]
  );

  const handleChange = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  // ADD FROM SUGGESTION
  const addSkill = (index, skill) => {
    const updated = [...skills];

    if (!updated[index].skills.includes(skill)) {
      updated[index].skills.push(skill);
    }

    setSkills(updated);
  };

  // REMOVE TAG
  const removeSkill = (index, skill) => {
    const updated = [...skills];

    updated[index].skills =
      updated[index].skills.filter(s => s !== skill);

    setSkills(updated);
  };

  // ADD MANUAL SKILL
  const addManualSkill = (index) => {
    const updated = [...skills];

    if (updated[index].manualSkill.trim() !== "" &&
        !updated[index].skills.includes(updated[index].manualSkill)) {
      updated[index].skills.push(updated[index].manualSkill);
    }

    updated[index].manualSkill = "";
    setSkills(updated);
  };

  const addCard = () => {
    setSkills([
      ...skills,
      {
        domain: "",
        customDomain: "",
        skills: [],
        manualSkill: "",
        url: ""
      }
    ]);
  };

  const removeCard = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateData({ skills });
    nextStep();
  };

  return (
    <div className="skills-wrapper">

      <h2 className="title">Skills & Portfolio</h2>

      {skills.map((item, index) => (
        <div key={index} className="card">

          {/* DOMAIN */}
          <select
            className="input"
            value={item.domain}
            onChange={(e) =>
              handleChange(index, "domain", e.target.value)
            }
          >
            <option value="">Select Domain</option>
            {Object.keys(DOMAIN_SKILLS).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* SKILL INPUT (YOU REQUESTED THIS) */}
          <div className="skill-input-row">

            <input
              className="input"
              placeholder="Type skill manually"
              value={item.manualSkill}
              onChange={(e) =>
                handleChange(index, "manualSkill", e.target.value)
              }
            />

            <button
              className="add-small"
              onClick={() => addManualSkill(index)}
            >
              Add
            </button>

          </div>

          {/* TAGS */}
          <div className="tag-box">
            {item.skills.map((s, i) => (
              <span key={i} className="tag">
                {s}
                <button onClick={() => removeSkill(index, s)}>×</button>
              </span>
            ))}
          </div>

          {/* SUGGESTIONS */}
          {item.domain && DOMAIN_SKILLS[item.domain] && (
            <div className="suggestions">
              {DOMAIN_SKILLS[item.domain].map((s, i) => (
                <span
                  key={i}
                  className="chip"
                  onClick={() => addSkill(index, s)}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* URL */}
          <input
            className="input"
            placeholder="Project URL"
            value={item.url}
            onChange={(e) =>
              handleChange(index, "url", e.target.value)
            }
          />

          {/* REMOVE CARD BUTTON (FIXED MISSING PART) */}
          {skills.length > 1 && (
            <button className="danger" onClick={() => removeCard(index)}>
              Remove
            </button>
          )}

        </div>
      ))}

      <button className="addBtn" onClick={addCard}>
        + Add More
      </button>

      <div className="nav">

        <button className="secondary" onClick={prevStep}>
          Back
        </button>

        {/* KEEP YOUR GLOW BUTTON STYLE */}
        <button className="neon-button" onClick={handleNext}>
          Next
        </button>

      </div>

    </div>
  );
};

export default SkillsInfo;