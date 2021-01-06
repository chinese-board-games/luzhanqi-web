import React from "react";

const BoardBackground = () => (
  <svg style={{ position: "absolute", width: "582px" }} viewBox="0 0 582 1006">
    <g>
      {/* Roads */}
      <rect
        style={{ fill: "none" }}
        x="12%"
        y="5%"
        width="76%"
        height="90%"
        stroke="black"
        strokeWidth="0.25em"
      />
      <line
        x1="50%"
        y1="5%"
        x2="50%"
        y2="95%"
        stroke="black"
        strokeWidth="0.25em"
      />

      {/* Railroads */}
      <rect
        style={{ fill: "none" }}
        x="12%"
        y="12.5%"
        width="76%"
        height="75.5%"
        stroke="brown"
        strokeWidth="0.25em"
      />

      <rect
        style={{ fill: "none" }}
        x="12%"
        y="41%"
        width="76%"
        height="18%"
        stroke="brown"
        strokeWidth="0.25em"
      />

      {/* Upper safe zones */}
      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="50%"
          cy="26.65%"
          r={45}
        />
        <text
          fontSize={35}
          x="50%"
          y="26.65%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>

      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="31%"
          cy="19.45%"
          r={45}
        />
        <text
          fontSize={35}
          x="31%"
          y="19.45%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>
      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="69%"
          cy="19.45%"
          r={45}
        />
        <text
          fontSize={35}
          x="69%"
          y="19.45%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>

      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="31%"
          cy="33.75%"
          r={45}
        />
        <text
          fontSize={35}
          x="31%"
          y="33.75%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>
      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="69%"
          cy="33.75%"
          r={45}
        />
        <text
          fontSize={35}
          x="69%"
          y="33.75%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>

      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="50%"
          cy="73.35%"
          r={45}
        />
        <text
          fontSize={35}
          x="50%"
          y="73.35%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>
      {/* Lower safe zones */}
      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="31%"
          cy="80.55%"
          r={45}
        />
        <text
          fontSize={35}
          x="31%"
          y="80.55%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>
      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="69%"
          cy="80.55%"
          r={45}
        />
        <text
          fontSize={35}
          x="69%"
          y="80.55%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>

      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="31%"
          cy="66.25%"
          r={45}
        />
        <text
          fontSize={35}
          x="31%"
          y="66.25%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>
      <g>
        <circle
          style={{ fill: "white" }}
          stroke="black"
          strokeWidth="8"
          cx="69%"
          cy="66.25%"
          r={45}
        />
        <text
          fontSize={35}
          x="69%"
          y="66.25%"
          textAnchor="middle"
          stroke="black"
          strokeWidth="0.5px"
          dy=".3em"
        >
          行營
        </text>
      </g>
    </g>
  </svg>
);

export default BoardBackground;
