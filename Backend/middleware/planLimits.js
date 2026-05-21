import { getPlan } from "../config/plans.js";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function checkMessageLimit(req, res, next) {
  const user = req.user;
  const plan = getPlan(user.plan);
  const today = todayKey();

  if (user.messageCountDate !== today) {
    user.messageCountToday = 0;
    user.messageCountDate = today;
  }

  if (
    plan.dailyMessageLimit !== null &&
    user.messageCountToday >= plan.dailyMessageLimit
  ) {
    return res.status(403).json({
      error: `Daily limit reached for ${plan.name} plan. Upgrade to continue.`,
      plan: user.plan,
      limit: plan.dailyMessageLimit,
    });
  }

  req.planConfig = plan;
  next();
}

export async function incrementMessageCount(user) {
  const today = todayKey();

  if (user.messageCountDate !== today) {
    user.messageCountToday = 0;
    user.messageCountDate = today;
  }

  user.messageCountToday += 1;
  await user.save();
}
