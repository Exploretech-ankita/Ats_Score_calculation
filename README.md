# Ats_Score_calculation
This an ats score calculation software . Its a secure platform . Where you can calculate the ats score of your resume and each and every part is customizable from parser to software itself . 
# ATSPro - ATS Resume Analyzer

ATSPro is a modern Resume Analyzer built using React, Express.js, and MongoDB. It allows users to upload their resumes, automatically extracts resume information, calculates an ATS (Applicant Tracking System) score, identifies missing keywords, and provides a detailed analysis of the resume.

---

## Features

- Upload Resume (PDF/DOCX)
- Automatic Resume Parsing
- ATS Score Calculation
- Skill Analysis
- Missing Keyword Detection
- Resume Completion Percentage
- Resume Details
  - Experience
  - Education
  - Certifications
- Recent Resume History
- User Authentication (Login/Register)
- Responsive Dashboard UI

---

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- Multer
- PDF Parser
- Mammoth (DOCX Parsing)

### Database

- MongoDB
- Mongoose

---

## Project Structure

```
## Project Structure

ATS_Score_calculator/
│
├── backend/
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resume.js
│   │   ├── localResumeParser.js
│   │   └── ai.js
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── public/
│
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── dashboard.css
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Registration.jsx
│   │   ├── registration.css
│   │   ├── form.jsx
│   │   ├── form.css
│   │   ├── ReviewSubmit.jsx
│   │   ├── profile.jsx
│   │   ├── ATSGuide.jsx
│   │   ├── ATSGuide.css
│   │   ├── AboutInfo.jsx
│   │   ├── PersonalInfo.jsx
│   │   ├── EducationInfo.jsx
│   │   ├── ExperienceInfo.jsx
│   │   ├── skillsInfo.jsx
│   │   └── skillsInfo.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── node_modules/
│
├── .gitignore
├── env.example
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── SkillsInfo2.jsx

```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/ATSPro.git
```

```bash
cd ATSPro
```

---

## Backend Setup

Move into backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Start MongoDB.

Run the backend

```bash
npm run dev
```

or

```bash
node server.js
```

Backend runs on

```
http://localhost:5000
```

---

## Frontend Setup

Move into frontend folder

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Start React

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## API Endpoints

### Authentication

#### Register

```
POST /api/auth/register
```

#### Login

```
POST /api/auth/login
```

---

### Resume Parser

```
POST /api/parse-resume
```

Upload a resume using multipart/form-data.

Returns

```json
{
  "fileName": "resume.pdf",
  "atsScore": 85,
  "role": "Frontend Developer",
  "skills": [
    {
      "name": "React",
      "score": 92
    }
  ],
  "missingKeywords": [
    "Docker",
    "AWS"
  ],
  "projects": [
    "Portfolio Website"
  ],
  "certifications": [
    "AWS Cloud Practitioner"
  ],
  "experience": "2 Years",
  "education": "B.Tech CSE",
  "resumeCompletion": 88
}
```

---

## Dashboard

The dashboard displays

- Average ATS Score
- Top Skill
- Resume Completion
- Resume Details
- Skill Analysis
- Missing Keywords
- Recent Resume History

---

## Dependencies

### Frontend

- react
- react-router-dom
- recharts

### Backend

- express
- mongoose
- multer
- cors
- bcrypt
- jsonwebtoken
- pdf-parse
- mammoth

---

## Future Improvements

- Resume Templates
- PDF Resume Generator
- AI Resume Suggestions
- Job Recommendation System
- Resume Version Management
- Dark/Light Theme
- User Profile Management

---

## Screenshots

Add screenshots here.

```
Home Page

Dashboard

Resume Analysis

Login Page

Register Page
```

---

## Author

**Ankita Pramanik**

Computer Science & Engineering Student

---

## License

This project is developed for educational purposes.
