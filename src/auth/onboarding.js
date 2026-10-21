const key = (userId) => `kuewenta_onboarded_${userId}`;

export const isOnboarded = (userId) => localStorage.getItem(key(userId)) === "1";
export const markOnboarded = (userId) => localStorage.setItem(key(userId), "1");
