import React from 'react';

const BoardBackground = () => (
  <svg style={{ position: 'absolute', width: '582px' }} viewBox="0 0 582 1006">
    <g>
      {/* Roads */}
      <rect
        style={{ fill: 'none' }}
        x="12%"
        y="5%"
        width="76%"
        height="90%"
        stroke="black"
        strokeWidth="0.25em"
      />

      {/* vertical line down center */}
      <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="black" strokeWidth="0.25em" />

      {/* opponent's map roads */}
      {/* vertical line from top left HQ */}
      <line x1="31.5%" y1="5%" x2="31.5%" y2="12.5%" stroke="black" strokeWidth="0.25em" />

      {/* vertical line from top right HQ */}
      <line x1="69.5%" y1="5%" x2="69.5%" y2="12.5%" stroke="black" strokeWidth="0.25em" />

      {/* eight lines coming from top left safe zone */}
      <line x1="12%" y1="12.5%" x2="31.5%" y2="19.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="12%" y1="19.5%" x2="31.5%" y2="19.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="12%" y1="26.5%" x2="31.5%" y2="19.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="31.5%" y1="19.5%" x2="50%" y2="12.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="19.5%" x2="50%" y2="19.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="19.5%" x2="50%" y2="26.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="31.5%" y1="19.5%" x2="31.5%" y2="26.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="19.5%" x2="31.5%" y2="12.5%" stroke="black" strokeWidth="0.25em" />

      {/* eight lines coming from top right safe zone */}
      <line x1="69.5%" y1="19.5%" x2="88.5%" y2="12.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="19.5%" x2="88.5%" y2="26.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="19.5%" x2="88.5%" y2="19.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="50%" y1="12.5%" x2="69.5%" y2="19.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="50%" y1="19.5%" x2="69.5%" y2="19.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="50%" y1="26.5%" x2="69.5%" y2="19.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="69.5%" y1="19.5%" x2="69.5%" y2="26.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="19.5%" x2="69.5%" y2="12.5%" stroke="black" strokeWidth="0.25em" />

      {/* line running across center top */}
      <line x1="12%" y1="26.5%" x2="88.5%" y2="26.5%" stroke="black" strokeWidth="0.25em" />

      {/* eight lines coming from bottom left safe zone */}
      <line x1="12%" y1="26.5%" x2="31.5%" y2="33.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="12%" y1="33.5%" x2="31.5%" y2="33.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="12%" y1="40.5%" x2="31.5%" y2="33.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="31.5%" y1="33.5%" x2="50%" y2="26.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="33.5%" x2="50%" y2="33.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="33.5%" x2="50%" y2="40.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="31.5%" y1="33.5%" x2="31.5%" y2="40.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="33.5%" x2="31.5%" y2="26.5%" stroke="black" strokeWidth="0.25em" />

      {/* eight lines coming from bottom right safe zone */}
      <line x1="69.5%" y1="33.5%" x2="88.5%" y2="26.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="33.5%" x2="88.5%" y2="33.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="33.5%" x2="88.5%" y2="40.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="50%" y1="26.5%" x2="69.5%" y2="33.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="50%" y1="33.5%" x2="69.5%" y2="33.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="50%" y1="40.5%" x2="69.5%" y2="33.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="69.5%" y1="33.5%" x2="69.5%" y2="26.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="33.5%" x2="69.5%" y2="40.5%" stroke="black" strokeWidth="0.25em" />

      {/* friendly map roads */}
      {/* vertical line from bottom left HQ */}
      <line x1="31.5%" y1="95%" x2="31.5%" y2="88%" stroke="black" strokeWidth="0.25em" />

      {/* vertical line from bottom right HQ */}
      <line x1="69.5%" y1="95%" x2="69.5%" y2="88%" stroke="black" strokeWidth="0.25em" />

      {/* eight lines coming from top left safe zone */}
      <line x1="12%" y1="59%" x2="31.5%" y2="66.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="12%" y1="66.5%" x2="31.5%" y2="66.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="12%" y1="74%" x2="31.5%" y2="66.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="31.5%" y1="66.5%" x2="50%" y2="59%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="66.5%" x2="50%" y2="66.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="66.5%" x2="50%" y2="74%" stroke="black" strokeWidth="0.25em" />

      <line x1="31.5%" y1="66.5%" x2="31.5%" y2="74%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="66.5%" x2="31.5%" y2="59%" stroke="black" strokeWidth="0.25em" />

      {/* eight lines coming from top right safe zone */}
      <line x1="69.5%" y1="66.5%" x2="88.5%" y2="59%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="66.5%" x2="88.5%" y2="66.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="66.5%" x2="88.5%" y2="74%" stroke="black" strokeWidth="0.25em" />

      <line x1="50%" y1="59%" x2="69.5%" y2="66.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="50%" y1="66.5%" x2="69.5%" y2="66.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="50%" y1="74%" x2="69.5%" y2="66.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="69.5%" y1="66.5%" x2="69.5%" y2="74%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="66.5%" x2="69.5%" y2="59%" stroke="black" strokeWidth="0.25em" />

      {/* line running across center bottom */}
      <line x1="12%" y1="73.5%" x2="88.5%" y2="73.5%" stroke="black" strokeWidth="0.25em" />

      {/* eight lines coming from bottom left safe zone */}
      <line x1="12%" y1="74%" x2="31.5%" y2="80.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="12%" y1="80.5%" x2="31.5%" y2="80.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="12%" y1="88%" x2="31.5%" y2="80.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="31.5%" y1="80.5%" x2="50%" y2="74%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="80.5%" x2="50%" y2="80.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="80.5%" x2="50%" y2="88%" stroke="black" strokeWidth="0.25em" />

      <line x1="31.5%" y1="80.5%" x2="31.5%" y2="88%" stroke="black" strokeWidth="0.25em" />
      <line x1="31.5%" y1="80.5%" x2="31.5%" y2="74%" stroke="black" strokeWidth="0.25em" />

      {/* eight lines coming from bottom right safe zone */}
      <line x1="69.5%" y1="80.5%" x2="88.5%" y2="74%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="80.5%" x2="88.5%" y2="80.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="80.5%" x2="88.5%" y2="88%" stroke="black" strokeWidth="0.25em" />

      <line x1="50%" y1="74%" x2="69.5%" y2="80.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="50%" y1="80.5%" x2="69.5%" y2="80.5%" stroke="black" strokeWidth="0.25em" />
      <line x1="50%" y1="88%" x2="69.5%" y2="80.5%" stroke="black" strokeWidth="0.25em" />

      <line x1="69.5%" y1="80.5%" x2="69.5%" y2="88%" stroke="black" strokeWidth="0.25em" />
      <line x1="69.5%" y1="80.5%" x2="69.5%" y2="74%" stroke="black" strokeWidth="0.25em" />

      {/* Railroads */}
      <rect
        style={{ fill: 'none' }}
        x="12%"
        y="12.5%"
        width="76%"
        height="75.5%"
        stroke="brown"
        strokeWidth="0.25em"
      />

      <rect
        style={{ fill: 'none' }}
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
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>

      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>
      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>

      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>
      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>

      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>
      {/* Lower safe zones */}
      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>
      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>

      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>
      <g>
        <circle
          style={{ fill: 'white' }}
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
          dy=".3em">
          行營
        </text>
      </g>
    </g>
  </svg>
);

export default BoardBackground;
