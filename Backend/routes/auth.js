import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";
import { PLANS, PLAN_IDS, getPlan } from "../config/plans.js";

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      plan: "free",
    });

    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user._id);

    return res.json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  const plan = getPlan(req.user.plan);
  const today = new Date().toISOString().slice(0, 10);
  const usedToday =
    req.user.messageCountDate === today ? req.user.messageCountToday : 0;

  return res.json({
    user: req.user.toPublicJSON(),
    usage: {
      messagesToday: usedToday,
      dailyLimit: plan.dailyMessageLimit,
      plan: req.user.plan,
    },
  });
});

router.get("/plans", (_req, res) => {
  return res.json(
    PLAN_IDS.map((id) => ({
      id,
      name: PLANS[id].name,
      price: PLANS[id].price,
      dailyMessageLimit: PLANS[id].dailyMessageLimit,
      model: PLANS[id].model,
    }))
  );
});

router.post("/upgrade", authRequired, async (req, res) => {
  const { plan } = req.body;

  if (!PLAN_IDS.includes(plan)) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  if (plan === "free") {
    req.user.plan = "free";
    await req.user.save();
    return res.json({ user: req.user.toPublicJSON(), message: "Plan updated to Free" });
  }

  req.user.plan = plan;
  await req.user.save();

  return res.json({
    user: req.user.toPublicJSON(),
    message: `Upgraded to ${getPlan(plan).name} successfully`,
  });
});

export default router;
