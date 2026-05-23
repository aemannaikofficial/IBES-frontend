/**
 * 🔐 IBES Portal - Centralized User & Leader Registry
 * --------------------------------------------------
 * This file serves as the single source of truth for all 
 * administrative and academic accounts in the portal.
 */

export const ADMIN_CONFIG = {
  email: "aemannaik.official@gmail.com",
  name: "Admin (IBES)",
  password: "123456" // Standard mock password
};
export const DEFAULT_PROGRAMMES = [
  "Doctor of Business Administration (DBA) Mixed Mode",
  "Doctor of Business Administration by (Research)",
  "Doctor of Education (EdD) Mixed Mode",
  "Doctor of Education (EdD) Research Mode",
  "Mastère TESOL",
  "Master of Business Administration",
  "Master of Education - M.Ed",
  "Bachelors of Arts(Hons) in Business Administration",
  "Bachelor of Arts in Education",
  "Bachelor of Science (Hons) in Computer Science"
];

export const DEFAULT_MODULES = [
  { name: "Strategic Management", code: "MGT701", credits: 20, programmes: ["Doctor of Business Administration (DBA) Mixed Mode", "Master of Business Administration"] },
  { name: "Research Methodology", code: "RES801", credits: 40, programmes: ["Doctor of Business Administration (DBA) Mixed Mode", "Doctor of Education (EdD) Mixed Mode"] },
  { name: "Advanced Educational Leadership", code: "EDU705", credits: 20, programmes: ["Doctor of Education (EdD) Mixed Mode", "Master of Education - M.Ed"] },
  { name: "Corporate Finance", code: "FIN602", credits: 15, programmes: ["Master of Business Administration"] }
];

export const DEFAULT_INTAKES = [
  "September 2025",
  "January 2026",
  "May 2026",
  "September 2026"
];

export const LEADER_REGISTRY = [
  {
    name: "Dr. Sarah Collins",
    email: "sarah@gmail.com",
    password: "123456",
    programmes: [
      "Doctor of Business Administration (DBA) Mixed Mode",
      "Doctor of Business Administration by (Research)",
      "Master of Business Administration",
      "Bachelors of Arts(Hons) in Business Administration"
    ]
  },
  {
    name: "Dr. Alice Thompson",
    email: "alice@gmail.com",
    password: "123456",
    programmes: [
      "Doctor of Education (EdD) Mixed Mode",
      "Doctor of Education (EdD) Research Mode",
      "Master of Education - M.Ed",
      "Bachelor of Arts in Education"
    ]
  },
  {
    name: "Prof. James Miller",
    email: "james@gmail.com",
    password: "123456",
    programmes: [
      "Doctor of Business Administration (DBA) Mixed Mode",
      "Master of Business Administration"
    ]
  },
  {
    name: "Prof. Robert Reed",
    email: "robert@gmail.com",
    password: "123456",
    programmes: [
      "Doctor of Education (EdD) Mixed Mode",
      "Bachelor of Arts in Education"
    ]
  },
  {
    name: "Dr. Emily Watson",
    email: "emily@gmail.com",
    password: "123456",
    programmes: ["Mastère TESOL"]
  },
  {
    name: "Dr. Kevin Zhang",
    email: "kevin@gmail.com",
    password: "123456",
    programmes: ["Bachelor of Science (Hons) in Computer Science"]
  },
  {
    name: "Prof. Linda Wu",
    email: "linda@gmail.com",
    password: "123456",
    programmes: ["Bachelor of Science (Hons) in Computer Science"]
  }
];

/**
 * Validates credentials against the registry
 * @returns {Object|null} The user object if valid, else null
 */
export const validateAuth = (role, email, password, leadersList = LEADER_REGISTRY) => {
  if (role === 'admin') {
    // Admin password is fixed for now as per original
    if (password !== ADMIN_CONFIG.password) return null;
    return email.toLowerCase() === ADMIN_CONFIG.email.toLowerCase() ? ADMIN_CONFIG : null;
  }

  const leader = leadersList.find(l => l.email.toLowerCase() === email.toLowerCase());
  if (leader) {
    // Use generated password if it exists, fallback to default
    const validPass = leader.password || "123456";
    return password === validPass ? leader : null;
  }
  return null;
};

/**
 * Returns a list of leader names for a specific programme
 */
export const getLeadersForProgramme = (programmeName, leadersList = LEADER_REGISTRY) => {
  return leadersList
    .filter(leader => leader.programmes.includes(programmeName))
    .map(leader => leader.name);
};
