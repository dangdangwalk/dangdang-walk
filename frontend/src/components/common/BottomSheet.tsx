import { Button } from '@/components/common/Button';
import { NAV_HEIGHT } from '@/constants/style';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}
export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
    return (
        <>
            <div
                className={`absolute inset-0 z-20  bg-neutral-800 opacity-40 ${isOpen ? 'block' : 'hidden'}`}
                onClick={onClose}
            ></div>
            <div
                className={` bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl pt-6 transition-transform  ${isOpen ? 'translate-y-0 absolute' : 'translate-y-full'}`}
            >
                {children}
            </div>
        </>
    );
}

function Header({ children }: { children?: React.ReactNode }) {
    return <div className="text-center text-black text-base font-semibold leading-normal mb-4">{children}</div>;
}
function Body({ children }: { children?: React.ReactNode }) {
    return <ul className="flex flex-col px-5 overflow-y-scroll h-[180px]">{children}</ul>;
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
