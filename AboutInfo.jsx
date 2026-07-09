import React, { useState }  from "react";

const AboutInfo = ({ nextStep, prevStep, updateData, data }) => {
  return (
    <div>
      <h2>About Yourself</h2>

      <textarea
        className="neon-input"
        placeholder="Write something about yourself..."
        value={data.about || ""}
        onChange={(e) => updateData({ about: e.target.value })}
        rows={6}
      />

      <div className="button-group">
        <button className="neon-button" onClick={prevStep}>
          Back
        </button>

        <button className="neon-button" onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AboutInfo;