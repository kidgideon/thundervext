import "../styles/smart.css";
import whaleOne from "../images/whale_one.jpg";
import whaleTwo from "../images/whale_two.jpg";
import whaleThree from "../images/whale_three.jpg";

const SmartProfile = () => {
  const profiles = [
    {
      image: whaleOne,
      name: "CryptoWhaleX",
      profit: "+142% yearly gain",
    },
    {
      image: whaleTwo,
      name: "BlockTitan",
      profit: "+98.3% yearly gain",
    },
    {
      image: whaleThree,
      name: "DeFiGuru",
      profit: "+123.5% yearly gain",
    },
  ];

  return (
    <div className="smart-profiles-container">
    <div className="tradersTop">
        <h1>Smart Profiles ™</h1>
        <p>These are our big crypto profile</p>
      </div>

      <div className="smart-profiles-grid">
        {profiles.map((profile, index) => (
          <div
            className="smart-profile-card"
            key={index}
            style={{ backgroundImage: `url(${profile.image})` }}
          >
            <div className="smart-profile-overlay">
              <p className="smart-profile-name">{profile.name}</p>
              <p className="smart-profile-profit">{profile.profit}</p>
              <p className="smart-profile-extra">Elite investor | Top performer</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartProfile;
