import logoImg from "../assets/logo.png";
import "./Logo.css";

function Logo({ size = "md", className = "" }) {
  return (
    <img
      src={logoImg}
      alt="SigmaGPT"
      className={`appLogo appLogo--${size} ${className}`.trim()}
    />
  );
}

export default Logo;
