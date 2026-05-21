import { useEffect, useState } from "react";
import "./Modal.css";
import { useAuth } from "../AuthContext.jsx";
import { fetchPlans, upgradePlan, fetchMe } from "../api.js";

const PLAN_FEATURES = {
  free: ["20 messages per day", "GPT-4o mini model", "Chat history"],
  pro: ["200 messages per day", "GPT-4o model", "Priority support"],
  prime: ["Unlimited messages", "GPT-4o model", "Early access features"],
};

function UpgradeModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    fetchPlans()
      .then(setPlans)
      .catch((err) => setError(err.message));
  }, []);

  const handleUpgrade = async (planId) => {
    if (planId === user?.plan) return;

    setLoading(planId);
    setError("");

    try {
      const data = await upgradePlan(planId);
      const me = await fetchMe();
      updateUser(data.user, me.usage);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const displayPlans =
    plans.length > 0
      ? plans
      : [
          { id: "free", name: "Free", price: 0, dailyMessageLimit: 20 },
          { id: "pro", name: "Pro", price: 9.99, dailyMessageLimit: 200 },
          { id: "prime", name: "Prime", price: 19.99, dailyMessageLimit: null },
        ];

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Upgrade your plan</h2>
          <button type="button" className="modalClose" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modalBody">
          {error && <p className="formError">{error}</p>}

          <div className="planGrid">
            {displayPlans.map((plan) => {
              const isCurrent = user?.plan === plan.id;
              const features = PLAN_FEATURES[plan.id] || [];

              return (
                <div
                  key={plan.id}
                  className={`planCard ${isCurrent ? "current" : ""}`}
                >
                  {isCurrent && <span className="currentLabel">Current</span>}
                  <h3>{plan.name}</h3>
                  <div className="planPrice">
                    ${plan.price}
                    <span>/mo</span>
                  </div>
                  <ul className="planFeatures">
                    {features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`btnPlan ${plan.id !== "free" ? "primary" : ""}`}
                    disabled={isCurrent || loading === plan.id}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {loading === plan.id
                      ? "Updating..."
                      : isCurrent
                        ? "Current plan"
                        : plan.id === "free"
                          ? "Downgrade"
                          : `Get ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
