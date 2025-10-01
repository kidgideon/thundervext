import RobotImage from "../images/robot.png";
import "../styles/robot.css";

const abilities = [
  { name: "Risk Management", level: 97 },
  { name: "Pattern Detection", level: 92 },
  { name: "Trade Speed", level: 88 },
  { name: "Market Prediction", level: 90 },
  { name: "Capital Preservation", level: 94 },
  { name: "Signal Accuracy", level: 89 },
  { name: "Adaptive Learning", level: 85 },
  { name: "Scalping Ability", level: 80 },
  { name: "Portfolio Balance", level: 91 },
  { name: "Execution Precision", level: 95 },
];

const Robot = () => {
  return (
    <div className="Robot-interface-mx-13">
      <div className="robot-mx-14">
        <img src={RobotImage} alt="Trading Robot" />
      </div>

      <div className="default-ability-bar">
        <h2>Trade AI Abilities</h2>
        {abilities.map((ability, index) => (
          <div className="ability-bar" key={index}>
            <div className="ability-label">
              <span>{ability.name}</span>
              <span>{ability.level}%</span>
            </div>
            <div className="ability-progress">
              <div
                className="ability-fill"
                style={{ width: `${ability.level}%` }}
              ></div>
            </div>
          </div>
        ))}

        <p className="trade-performance-note">
          Your trade performance is determined by the quality of AI trade you
          purchased.
        </p>
      </div>
    </div>
  );
};

export default Robot;
