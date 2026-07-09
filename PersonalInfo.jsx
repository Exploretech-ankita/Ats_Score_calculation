import React, { useState } from "react";

const PersonalInfo = ({ nextStep, updateData, data }) => {
  const [form, setForm] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => {
    updateData(form);
    nextStep();
  };

  return (
    <div>
      <input className="neon-input" type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
      <input className="neon-input" type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
      <input className="neon-input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input className="neon-input" type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />

      <div className="button-group">
        <button className="neon-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default PersonalInfo;