import React, { useState } from "react";

const EducationInfo = ({ nextStep, prevStep, updateData, data }) => {
  const [form, setForm] = useState({
    college: data.college || "",
    degree: data.degree || "",
    branch: data.branch || "",
    graduationYear: data.graduationYear || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => {
    updateData(form);
    nextStep();
  };

  return (
    <div>
      <input className="neon-input" type="text" name="college" placeholder="College Name" value={form.college} onChange={handleChange} />
      <input className="neon-input" type="text" name="degree" placeholder="Degree" value={form.degree} onChange={handleChange} />
      <input className="neon-input" type="text" name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} />
      <input className="neon-input" type="text" name="graduationYear" placeholder="Graduation Year" value={form.graduationYear} onChange={handleChange} />

      <div className="button-group">
        <button className="neon-button" onClick={prevStep}>Back</button>
        <button className="neon-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default EducationInfo;