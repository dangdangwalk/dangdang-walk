import type { SVGProps } from 'react';

const variants = {
    primary: {
        circle1: 'stroke-primary',
        circle2: 'hidden',
        path: 'fill-primary',
    },
    secondary: {
        circle1: 'hidden',
        circle2: 'fill-secondary',
        path: 'fill-[#222222]',
    },
} as const;

function Urine({ color, ...props }: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
            <circle cx={12} cy={12} r={11.5} className={variants[color].circle1} />
            <circle cx={12} cy={12} r={12} className={variants[color].circle2} />
            <path
                className={variants[color].path}
                d="M12 18a4.5 4.5 0 0 1-4.5-4.5c0-3 4.5-8.062 4.5-8.062s4.5 5.062 4.5 8.062A4.5 4.5 0 0 1 12 18"
            />
        </svg>
    );
}

type Color = keyof typeof variants;

interface Props extends Omit<SVGProps<SVGSVGElement>, 'color'> {
    color: Color;
}

export { Urine };
