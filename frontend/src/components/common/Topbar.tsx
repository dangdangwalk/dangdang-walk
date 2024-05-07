import { TOP_BAR_HEIGHT } from '@/constants/style';

export default function Topbar({ children }: { children: React.ReactNode }) {
    return (
        <header className="flex w-full justify-between items-center px-2" style={{ height: TOP_BAR_HEIGHT }}>
            {children}
        </header>
    );
}

function Front({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>;
}
function Center({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>;
}
function Back({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>;
}

Topbar.Front = Front;
Topbar.Center = Center;
Topbar.Back = Back;
