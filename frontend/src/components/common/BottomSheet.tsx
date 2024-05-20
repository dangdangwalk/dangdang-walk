import { Button } from '@/components/common/Button';
import { NAV_HEIGHT } from '@/constants/style';
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
                    className={`fixed z-30 w-full h-full top-0 bg-neutral-800/40 backdrop-blur-sm`}
                    onClick={onClose}
                ></div>
            )}
            <div
                className={`fixed duration-300 z-40 ${isOpen ? 'bottom-0' : '-bottom-full'} left-0 right-0 bg-white rounded-t-2xl pt-6 `}
            >
                {children}
            </div>
        </>
    );
}

function Header({ children }: { children?: React.ReactNode }) {
    return <div className="text-center text-black text-base font-semibold leading-normal mb-4">{children}</div>;
}
function Body({ children, className }: { children?: React.ReactNode; className?: string }) {
    return <ul className={cn(`flex flex-col px-5 overflow-y-scroll h-[180px] ${className}`)}>{children}</ul>;
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
            className=" bottom-0 w-full"
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
