/** Honeypot field must be empty (bots often fill hidden fields). */
export function honeypotClean(formData: FormData, field = "website"): boolean {
  return String(formData.get(field) ?? "").trim() === "";
}

/** Link-stuffing / promo spam. */
export function countHttpUrls(text: string): number {
  return (text.match(/https?:\/\//gi) ?? []).length;
}

/** Detect keyboard-mash / repeated-character flooding. */
export function maxConsecutiveSameChar(text: string): number {
  if (!text) return 0;
  let max = 1;
  let run = 1;
  let prev = text[0]!;
  for (let i = 1; i < text.length; i++) {
    const ch = text[i]!;
    if (ch === prev) {
      run++;
      if (run > max) max = run;
    } else {
      run = 1;
      prev = ch;
    }
  }
  return max;
}
