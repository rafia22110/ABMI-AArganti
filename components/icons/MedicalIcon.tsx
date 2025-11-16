import React from 'react';

const MedicalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0 1.485-2.09 4.312-6.079 6.208C12.825 15.42 10.99 16.5 9 16.5c-1.99 0-3.825-1.08-5.921-2.042C-1.09 12.562 1 9.735 1 8.25 1 5.903 4.464 4.5 9 4.5c4.536 0 8.01 1.403 12 3.75Z" />
    </svg>
);

export default MedicalIcon;