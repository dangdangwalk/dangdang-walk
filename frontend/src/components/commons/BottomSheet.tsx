import { Button } from '@/components/commons/Button';
import Spinner from '@/components/commons/Spinner';
import { NAV_HEIGHT } from '@/constants';
import { cn } from '@/utils/tailwindClass';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}
export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
    return (
        <>
            {isOpen && (
                <div
                    className={`fixed top-0 z-30 size-full max-w-screen-sm bg-neutral-800/40 backdrop-blur-sm`}
                    onClick={onClose}
                ></div>
            )}
            <div
                className={`fixed z-40 w-full max-w-screen-sm rounded-t-2xl bg-white pt-6 duration-300 ${isOpen ? 'bottom-0' : '-bottom-full'} `}
            >
                {children}
            </div>
        </>
    );
}

function Header({ children }: { children?: React.ReactNode }) {
    return <div className="mb-4 text-center text-base font-semibold leading-normal text-black">{children}</div>;
}

interface BodyProps {
    children?: React.ReactNode;
    className?: string;
    isLoading?: boolean;
}

function Body({ children, className, isLoading }: BodyProps) {
    if (isLoading) return <Spinner className="h-[180px]" />;
    return <ul className={cn(`flex h-[180px] flex-col overflow-y-scroll px-5 ${className}`)}>{children}</ul>;
}
function Footer({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>;
}
function ConfirmButton({
    children,
    onConfirm,
    disabled,
}: {
    children: React.ReactNode;
    onConfirm: () => void;
    disabled: boolean;
}) {
    return (
        <Button
            className="bottom-0 w-full"
            style={{ height: NAV_HEIGHT }}
            rounded={'none'}
            disabled={disabled}
            onClick={onConfirm}
        >
            {children}
        </Button>
    );
}

BottomSheet.Header = Header;
BottomSheet.Body = Body;
BottomSheet.Footer = Footer;
BottomSheet.ConfirmButton = ConfirmButton;
