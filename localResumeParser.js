// ============================================================
// LOCAL RESUME PARSER — 100% free, no API calls, no signup.
// Uses keyword matching + regex heuristics on plain resume text.
// Tune the keyword lists below to improve accuracy for your use case.
// ============================================================

// A broad list of common tech/professional skills to scan for.
// Add/remove entries to match the roles your users apply for.
const SKILL_KEYWORDS = [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust",
    "react", "vue", "angular", "node.js", "node", "express", "next.js",
    "html", "css", "sass", "tailwind", "bootstrap",
    "mongodb", "postgresql", "mysql", "sqlite", "redis", "firebase",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd",
    "git", "github", "gitlab", "jira", "figma",
    "rest api", "graphql", "microservices", "websocket",
    "machine learning", "deep learning", "tensorflow", "pytorch", "nlp",
    "data analysis", "pandas", "numpy", "sql", "excel", "power bi", "tableau",
    "project management", "agile", "scrum", "communication", "leadership",
    "problem solving", "teamwork", "django", "flask", "spring boot",
    "swift", "kotlin", "flutter", "react native", "android", "ios",
];

// Keywords that signal an education section / degree line.
const DEGREE_KEYWORDS = [
    "bachelor", "master", "b.tech", "m.tech", "b.sc", "m.sc", "bca", "mca",
    "mba", "phd", "b.e", "m.e", "diploma", "associate degree", "high school",
];

// Keywords that signal a certification.
const CERTIFICATION_KEYWORDS = [
    "certified", "certificate", "certification", "aws certified",
    "google certified", "microsoft certified", "pmp", "scrum master",
];

// Section header patterns used to slice the resume into blocks.
const SECTION_HEADERS = {
    education: /education|academic background/i,
    experience: /experience|employment history|work history/i,
    projects: /projects|personal projects/i,
    certifications: /certifications?|licenses?/i,
    skills: /skills|technical skills|core competencies/i,
};

function splitIntoSections(text) {
    const lines = text.split(/\r?\n/);
    const sections = {};
    let currentSection = "header";
    sections[currentSection] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        let matchedHeader = null;

        for (const [name, pattern] of Object.entries(SECTION_HEADERS)) {
            // Treat short lines that match a header pattern as section breaks
            if (trimmed.length < 40 && pattern.test(trimmed)) {
                matchedHeader = name;
                break;
            }
        }

        if (matchedHeader) {
            currentSection = matchedHeader;
            sections[currentSection] = sections[currentSection] || [];
            continue;
        }

        sections[currentSection].push(line);
    }

    return sections;
}

function extractSkills(fullTextLower) {
    const found = [];
    for (const skill of SKILL_KEYWORDS) {
        const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        const matches = fullTextLower.match(new RegExp(pattern, "gi"));
        if (matches) {
            found.push({
                name: skill,
                score: Math.min(60 + matches.length * 10, 100) // more mentions = higher confidence
            });
        }
    }
    // Sort strongest first
    return found.sort((a, b) => b.score - a.score);
}

function extractMissingKeywords(foundSkillNames) {
    // Generic "commonly expected" keywords across most tech roles.
    // Anything from SKILL_KEYWORDS not found in the resume is flagged.
    const commonlyExpected = [
        "git", "rest api", "agile", "problem solving", "communication",
        "ci/cd", "docker", "sql"
    ];
    return commonlyExpected.filter(k => !foundSkillNames.includes(k));
}

function extractEducation(sectionLines) {
    const text = sectionLines.join(" ");
    const lower = text.toLowerCase();
    const found = DEGREE_KEYWORDS.find(d => lower.includes(d));
    if (!found) return "Not available";

    // Grab the line containing the degree keyword for a slightly richer summary
    const line = sectionLines.find(l => l.toLowerCase().includes(found));
    return (line || found).trim().slice(0, 120);
}

function extractExperience(sectionLines) {
    const text = sectionLines.join(" ");
    // Look for date ranges like "2019 - 2021", "Jan 2020 - Present", "2018-Present"
    const dateRangePattern = /(\b(?:19|20)\d{2}\b|\b[A-Za-z]{3,9}\s+(?:19|20)\d{2}\b)\s*[-–—to]+\s*(\b(?:19|20)\d{2}\b|present|current)/gi;
    const matches = [...text.matchAll(dateRangePattern)];

    if (matches.length === 0) {
        return sectionLines.some(l => l.trim().length > 0)
            ? "Experience listed (dates not detected)"
            : "Not available";
    }

    return `${matches.length} role${matches.length > 1 ? "s" : ""} detected (${matches[0][0]}${matches.length > 1 ? ", …" : ""})`;
}

function extractProjects(sectionLines) {
    return sectionLines
        .map(l => l.trim())
        .filter(l => l.length > 3 && l.length < 100 && !SECTION_HEADERS.projects.test(l))
        .slice(0, 8);
}

function extractCertifications(sectionLines, fullTextLower) {
    const fromSection = sectionLines
        .map(l => l.trim())
        .filter(l => l.length > 3 && l.length < 100);

    if (fromSection.length > 0) return fromSection.slice(0, 8);

    // Fallback: scan whole document for certification keywords
    return CERTIFICATION_KEYWORDS.filter(k => fullTextLower.includes(k));
}

function guessRole(sections, fullText) {
    // Heuristic: the first non-empty line of the header section is often
    // the name; the line right after often contains the target role/title.
    const headerLines = (sections.header || []).map(l => l.trim()).filter(Boolean);
    if (headerLines.length >= 2) {
        return headerLines[1].slice(0, 60);
    }
    return "Unknown";
}

function computeAtsScore({ skills, education, experience, certifications }) {
    let score = 30;
    score += Math.min(skills.length * 4, 35);         // skills breadth
    score += education !== "Not available" ? 15 : 0;
    score += experience !== "Not available" ? 15 : 0;
    score += certifications.length > 0 ? 5 : 0;
    return Math.min(Math.round(score), 100);
}

function computeCompletion({ skills, education, experience, projects, certifications }) {
    let pct = 10;
    pct += skills.length > 0 ? 25 : 0;
    pct += education !== "Not available" ? 20 : 0;
    pct += experience !== "Not available" ? 25 : 0;
    pct += projects.length > 0 ? 10 : 0;
    pct += certifications.length > 0 ? 10 : 0;
    return Math.min(pct, 100);
}

/**
 * Main entry point. Takes raw resume text, returns the exact shape
 * the frontend expects — no external API calls involved.
 */
function parseResumeLocally(rawText) {
    const sections = splitIntoSections(rawText);
    const fullTextLower = rawText.toLowerCase();

    const skills = extractSkills(fullTextLower);
    const skillNames = skills.map(s => s.name);
    const missingKeywords = extractMissingKeywords(skillNames);
    const education = extractEducation(sections.education || []);
    const experience = extractExperience(sections.experience || []);
    const projects = extractProjects(sections.projects || []);
    const certifications = extractCertifications(sections.certifications || [], fullTextLower);
    const role = guessRole(sections, rawText);

    const atsScore = computeAtsScore({ skills, education, experience, certifications });
    const resumeCompletion = computeCompletion({ skills, education, experience, projects, certifications });

    return {
        atsScore,
        role,
        skills,
        missingKeywords,
        projects,
        certifications,
        experience,
        education,
        resumeCompletion
    };
}

export { parseResumeLocally };
