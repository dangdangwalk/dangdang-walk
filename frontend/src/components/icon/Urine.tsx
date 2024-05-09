import type { SVGProps } from 'react';

const variants = {
    primary: {
        circle: 'stroke-primary',
        path: 'fill-primary',
    },
    secondary: {
        circle: 'stroke-secondary',
        path: 'fill-secondary',
    },
} as const;

function Urine({ color, ...props }: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
            <circle cx={12} cy={12} r={11.5} className={variants[color].circle} />
            <path
                className={variants[color].path}
                d="M12 18a4.5 4.5 0 0 1-4.5-4.5c0-3 4.5-8.062 4.5-8.062s4.5 5.062 4.5 8.062A4.5 4.5 0 0 1 12 18"
            />
        </svg>
    );
}

interface Props extends Omit<SVGProps<SVGSVGElement>, 'color'> {
    color: 'primary' | 'secondary';
}

export { Urine };
