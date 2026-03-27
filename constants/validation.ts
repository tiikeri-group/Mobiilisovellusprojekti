export const validateEmail = (email: string): string | null => {
  if (!email.includes("@")) return "Sähköpostissa tulee olla @-merkki";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "Salasanan tulee olla vähintään 8 merkkiä";
  if (!/[A-Z]/.test(password)) return "Salasanassa tulee olla vähintään yksi iso kirjain";
  if (!/[0-9]/.test(password)) return "Salasanassa tulee olla vähintään yksi numero";
  return null;
};