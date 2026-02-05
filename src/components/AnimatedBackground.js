import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      <div className="city-silhouette">
        <div className="buildings">
          <div className="building building1"></div>
          <div className="building building2"></div>
          <div className="building building3"></div>
          <div className="building building4"></div>
          <div className="building building5"></div>
          <div className="building building6"></div>
        </div>
      </div>
      <div className="road">
        <div className="lane-markings"></div>
      </div>
      <div className="bus">
        <div className="bus-windows"></div>
        <div className="bus-wheels">
          <div className="wheel"></div>
          <div className="wheel"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
