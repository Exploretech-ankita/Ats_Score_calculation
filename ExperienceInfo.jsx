import React, { useState } from "react";

const ExperienceInfo = ({ nextStep, prevStep, updateData, data }) => {
  const [form, setForm] = useState({
    company: data.company || "",
    role: data.role || "",
    experience: data.experience || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => {
    updateData(form);
    nextStep();
  };

  return (
    <div>
      <input className="neon-input" type="text" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} />
      <input className="neon-input" type="text" name="role" placeholder="Role" value={form.role} onChange={handleChange} />
      <input className="neon-input" type="text" name="experience" placeholder="Experience (in years)" value={form.experience} onChange={handleChange} />

      <div className="button-group">
        <button className="neon-button" onClick={prevStep}>Back</button>
        <button className="neon-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default ExperienceInfo;