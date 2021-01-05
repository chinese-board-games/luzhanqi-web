import React from "react";

const MountainPass = () => (
  <svg viewBox="0 0 100 20">
    <g>
      <rect
        style={{ fill: "black" }}
        x="2.5%"
        y="18%"
        width="15%"
        height="60%"
        stroke="black"
        strokeWidth="0.05em"
      />
      <text
        fontSize="31%"
        x="5%"
        y="24%"
        textAnchor="middle"
        stroke="white"
        strokeWidth="0.3px"
        dy="1.3em"
        dx="1em"
      >
        前線
      </text>

      <rect
        style={{ fill: "black" }}
        x="42.5%"
        y="18%"
        width="15%"
        height="60%"
        stroke="black"
        strokeWidth="0.05em"
      />
      <text
        fontSize="31%"
        x="45%"
        y="24%"
        textAnchor="middle"
        stroke="white"
        strokeWidth="0.3px"
        dy="1.3em"
        dx="1em"
      >
        前線
      </text>

      <rect
        style={{ fill: "black" }}
        x="82.5%"
        y="18%"
        width="15%"
        height="60%"
        stroke="black"
        strokeWidth="0.05em"
      />
      <text
        fontSize="31%"
        x="85%"
        y="24%"
        textAnchor="middle"
        stroke="white"
        strokeWidth="0.3px"
        dy="1.3em"
        dx="1em"
      >
        前線
      </text>
    </g>

    <g>
      <circle
        cx="30%"
        cy="50%"
        r="12%"
        fill="#FEF1C2"
        stroke="green"
        strokeWidth="2%"
      />
      <text
        fontSize="40%"
        x="30%"
        y="50%"
        textAnchor="middle"
        stroke="black"
        strokeWidth="0.3%"
        dy="9%"
      >
        山界
      </text>
    </g>
    <g>
      <circle
        cx="70%"
        cy="50%"
        r="12%"
        fill="#FEF1C2"
        stroke="green"
        strokeWidth="2%"
      />
      <text
        fontSize="40%"
        x="70%"
        y="50%"
        textAnchor="middle"
        stroke="black"
        strokeWidth="0.3%"
        dy="9%"
      >
        山界
      </text>
    </g>
  </svg>
);

export default MountainPass;
