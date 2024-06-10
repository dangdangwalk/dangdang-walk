import { TOP_BAR_HEIGHT } from '@/constants';
import { cn } from '@/utils/tailwindClass';

export default function TopBar({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <header
            className={cn(`flex w-full items-center justify-between px-2 ${className}`)}
            style={{ height: TOP_BAR_HEIGHT }}
        >
            {children}
        </header>
    );
}

function Front({
    children,
    onClick,
    className,
}: {
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <div className={className} onClick={onClick}>
            {children}
        </div>
    );
}
function Center({
    children,
    onClick,
    className,
}: {
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <div className={className} onClick={onClick}>
            {children}
        </div>
    );
}
function Back({
    children,
    onClick,
    className,
}: {
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <div className={className} onClick={onClick}>
            {children}
        </div>
    );
}

TopBar.Front = Front;
TopBar.Center = Center;
TopBar.Back = Back;
