import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./form.css";

import PersonalInfo from "./PersonalInfo";
import EducationInfo from "./EducationInfo";
import ExperienceInfo from "./ExperienceInfo";
import SkillsInfo from "./skillsInfo";
import AboutInfo from "./AboutInfo";
import ReviewSubmit from "./ReviewSubmit";

function Multistepform() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [direction, setDirection] = useState(1);

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const updateData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const pageVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.96,
    }),

    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },

    exit: (direction) => ({
      x: direction > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    }),
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfo
            nextStep={nextStep}
            updateData={updateData}
            data={formData}
          />
        );

      case 2:
        return (
          <EducationInfo
            nextStep={nextStep}
            prevStep={prevStep}
            updateData={updateData}
            data={formData}
          />
        );

      case 3:
        return (
          <ExperienceInfo
            nextStep={nextStep}
            prevStep={prevStep}
            updateData={updateData}
            data={formData}
          />
        );

      case 4:
        return (
          <SkillsInfo
            nextStep={nextStep}
            prevStep={prevStep}
            updateData={updateData}
            data={formData}
          />
        );

      case 5:
        return (
          <AboutInfo
            nextStep={nextStep}
            prevStep={prevStep}
            updateData={updateData}
            data={formData}
          />
        );

      case 6:
        return (
          <ReviewSubmit
            prevStep={prevStep}
            data={formData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">

      {/* LEFT PANEL */}
      <div className="left-panel">

        {/* PHOTO */}
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Apply Now!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Build your career and get rewarded.
        </motion.p>

        <div className="step-indicator">
          Step {step} of 6
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="form-motion-wrapper"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

export default Multistepform;