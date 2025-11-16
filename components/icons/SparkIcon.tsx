import React from 'react';

const SparkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 00B4.684 9.393l.813 2.846a.75.75 0 01-1.442.414l-.813-2.846a3.75 3.75 0 00-4.684-2.433l-2.846.813a.75.75 0 01-.414-1.442l2.846-.813a3.75 3.75 0 002.433-4.684zM15 1.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 004.684 2.433l2.846-.813a.75.75 0 01.414 1.442l-2.846.813a3.75 3.75 0 00-2.433 4.684l.813 2.846a.75.75 0 01-1.442.414l-.813-2.846a3.75 3.75 0 00-4.684-2.433l-2.846.813a.75.75 0 01-.414-1.442l2.846-.813a3.75 3.75 0 002.433-4.684z"
      clipRule="evenodd"
    />
  </svg>
);

export default SparkIcon;