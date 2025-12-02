// Simple client-side sanitization & validation helpers.
// These run in addition to server-side validation.

const stripScriptTags = (value) =>
  value.replace(/<script.*?>.*?<\/script>/gi, "");

export const sanitizeText = (value = "", maxLength = 250) => {
  if (typeof value !== "string") return "";
  let v = value.trim();
  v = stripScriptTags(v);
  return v.slice(0, maxLength);
};

export const sanitizeSearchTerm = (value = "") =>
  sanitizeText(value, 80).toLowerCase();

export const sanitizeNumber = (value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) => {
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
};

export const sanitizeUrl = (value = "") => {
  const v = sanitizeText(value, 2048);
  if (!v) return "";
  const pattern = /^https?:\/\/[^\s]+$/i;
  return pattern.test(v) ? v : "";
};

export const sanitizeEmail = (value = "") => {
  const v = sanitizeText(value, 254).toLowerCase();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(v) ? v : "";
};

export const sanitizeStartupForm = (form) => {
  const cleaned = {
    name: sanitizeText(form.name, 120),
    state: sanitizeText(form.state, 80),
    sector: sanitizeText(form.sector, 120),
    funding: sanitizeNumber(form.funding, { min: 0 }),
    turnover: sanitizeNumber(form.turnover, { min: 0 }),
    companytype: sanitizeText(form.companytype, 80),
    registrationDate: form.registrationDate ? new Date(form.registrationDate).toISOString() : undefined,
    rating: sanitizeNumber(form.rating, { min: 0, max: 5 }),
    description: sanitizeText(form.description, 2000),
    founder: sanitizeText(form.founder, 120),
    website: sanitizeUrl(form.website),
  };

  if (!cleaned.name) {
    return { ok: false, error: "Startup name is required." };
  }
  if (!cleaned.state) {
    return { ok: false, error: "State is required." };
  }
  if (!cleaned.sector) {
    return { ok: false, error: "Sector is required." };
  }

  return { ok: true, data: cleaned };
};

export const sanitizeLoginForm = (form) => {
  const email = sanitizeEmail(form.email);
  const password = sanitizeText(form.password, 128);
  const fullName = sanitizeText(form.fullName, 120);

  return {
    ...form,
    email,
    password,
    fullName,
  };
};


