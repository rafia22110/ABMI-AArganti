import React from 'react';

const AudioIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a3 3 0 0 0 3-3v-1.5a3 3 0 0 0-6 0v1.5a3 3 0 0 0 3 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a3.75 3.75 0 0 1-3.75 3.75v-1.5a2.25 2.25 0 0 0 2.25-2.25H6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75a3.75 3.75 0 0 0 3.75 3.75v-1.5a2.25 2.25 0 0 1-2.25-2.25H18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a8.25 8.25 0 0 1 16.5 0" />
    </svg>
);

export default AudioIcon;