const SHORT_MONTHS = ["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"];
const LONG_MONTHS = [
  "Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo",
  "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre",
];

export const peso = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

export const monthShort = (index) => SHORT_MONTHS[index];
export const monthLong = (index) => LONG_MONTHS[index];

export const shortDate = (date = new Date()) => {
  const d = new Date(date);
  return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
};

export const fullDate = (date = new Date()) => `${shortDate(date)}, ${new Date(date).getFullYear()}`;

export const timeOfDay = (date) =>
  new Date(date).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const daysSince = (date) => {
  if (!date) return 0;
  return Math.max(0, Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000));
};

/** "Ngayon, 9:30 AM", "Kahapon", or "Hun 12" */
export function relativeDay(date) {
  if (!date) return "Wala pang aktibidad";
  const days = daysSince(date);
  if (days === 0) return `Ngayon, ${timeOfDay(date)}`;
  if (days === 1) return "Kahapon";
  return shortDate(date);
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Magandang umaga!";
  if (hour < 13) return "Magandang tanghali!";
  if (hour < 18) return "Magandang hapon!";
  return "Magandang gabi!";
}
