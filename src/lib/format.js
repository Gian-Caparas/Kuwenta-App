const SHORT_MONTHS_FIL = ["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"];
const LONG_MONTHS_FIL = [
  "Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo",
  "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre",
];

const SHORT_MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG_MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const peso = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

const getMonthArrays = (language) => {
  const isFilipino = language === "filipino";
  return {
    short: isFilipino ? SHORT_MONTHS_FIL : SHORT_MONTHS_EN,
    long: isFilipino ? LONG_MONTHS_FIL : LONG_MONTHS_EN,
  };
};

export const monthShort = (index, language = "filipino") => {
  const { short } = getMonthArrays(language);
  return short[index];
};

export const monthLong = (index, language = "filipino") => {
  const { long } = getMonthArrays(language);
  return long[index];
};

export const shortDate = (date = new Date(), language = "filipino") => {
  const { short } = getMonthArrays(language);
  const d = new Date(date);
  return `${short[d.getMonth()]} ${d.getDate()}`;
};

export const fullDate = (date = new Date(), language = "filipino") => `${shortDate(date, language)}, ${new Date(date).getFullYear()}`;

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
export function relativeDay(date, language = "filipino") {
  if (!date) return language === "filipino" ? "Wala pang aktibidad" : "No activity yet";
  const days = daysSince(date);
  if (days === 0) return `${language === "filipino" ? "Ngayon" : "Today"}, ${timeOfDay(date)}`;
  if (days === 1) return language === "filipino" ? "Kahapon" : "Yesterday";
  return shortDate(date, language);
}

export function greeting(language = "filipino") {
  const hour = new Date().getHours();
  if (language === "filipino") {
    if (hour < 11) return "Magandang umaga!";
    if (hour < 13) return "Magandang tanghali!";
    if (hour < 18) return "Magandang hapon!";
    return "Magandang gabi!";
  } else {
    if (hour < 11) return "Good morning!";
    if (hour < 13) return "Good noon!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  }
}