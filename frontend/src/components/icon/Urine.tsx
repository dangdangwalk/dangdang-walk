import type { SVGProps } from 'react';

function Urine(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
            <circle cx={12} cy={12} r={11.5} stroke="#FF8A00" />
            <path
                fill="#FF8A00"
                d="M12 18a4.5 4.5 0 0 1-4.5-4.5c0-3 4.5-8.062 4.5-8.062s4.5 5.062 4.5 8.062A4.5 4.5 0 0 1 12 18"
            />
        </svg>
    );
}

export { Urine };
