import { Button } from '@/components/common/Button';
import { NAV_HEIGHT } from '@/constants/style';
import { useContext, createContext } from 'react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    disabled: boolean;
    children?: React.ReactNode;
}
const BottomSheetContext = createContext({ disabled: true });
export default function BottomSheet({ isOpen, onClose, children, disabled }: BottomSheetProps) {
    return (
        <BottomSheetContext.Provider value={{ disabled }}>
            <div className={`fixed inset-0 overflow-hidden z-50 ${isOpen ? 'block' : 'hidden'}`}>
                <div className="absolute inset-0  bg-neutral-800 opacity-40" onClick={onClose}></div>
                <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl pt-6 transform transition-transform ease-in-out duration-1000">
                    {/* <div className="text-center text-black text-base font-semibold leading-normal mb-4">강아지 선택</div> */}
                    {children}
                    {/* <ul className="flex flex-col px-5 overflow-y-scroll h-[180px]">{children}</ul>
                    <Button
                        className="absolue bottom-0 w-full"
                        style={{ height: NAV_HEIGHT }}
                        rounded={'none'}
                        disabled={disabled}
                    >
                        산책하기
                    </Button> */}
                </div>
            </div>
        </BottomSheetContext.Provider>
    );
}

function Header({ children }: { children?: React.ReactNode }) {
    return <div className="text-center text-black text-base font-semibold leading-normal mb-4">{children}</div>;
}
function Body({ children }: { children?: React.ReactNode }) {
    return <ul className="flex flex-col px-5 overflow-y-scroll h-[180px]">{children}</ul>;
}
function Footer({ children }: { children?: React.ReactNode }) {
    const { disabled } = useContext(BottomSheetContext);
    return (
        <Button className="absolue bottom-0 w-full" style={{ height: NAV_HEIGHT }} rounded={'none'} disabled={disabled}>
            {children}
        </Button>
    );
}

BottomSheet.Header = Header;
BottomSheet.Body = Body;
BottomSheet.Footer = Footer;
