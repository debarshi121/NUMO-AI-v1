// Customer-facing report ID: RPT-YYYYMMDD-XXXX (date + random suffix).
// Excludes 0/O/1/I from the suffix alphabet so a support agent reading it
// aloud never has to disambiguate.
const SUFFIX_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SUFFIX_LENGTH = 4;

function randomSuffix(): string {
  let suffix = "";
  for (let i = 0; i < SUFFIX_LENGTH; i++) {
    suffix += SUFFIX_ALPHABET[Math.floor(Math.random() * SUFFIX_ALPHABET.length)];
  }
  return suffix;
}

export function generateReportId(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `RPT-${y}${m}${d}-${randomSuffix()}`;
}
