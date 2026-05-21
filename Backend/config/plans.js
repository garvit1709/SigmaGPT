export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    dailyMessageLimit: 20,
    model: "gpt-4o-mini",
    price: 0,
  },
  pro: {
    id: "pro",
    name: "Pro",
    dailyMessageLimit: 200,
    model: "gpt-4o",
    price: 9.99,
  },
  prime: {
    id: "prime",
    name: "Prime",
    dailyMessageLimit: null,
    model: "gpt-4o",
    price: 19.99,
  },
};

export const PLAN_IDS = ["free", "pro", "prime"];

export function getPlan(planId) {
  return PLANS[planId] || PLANS.free;
}
