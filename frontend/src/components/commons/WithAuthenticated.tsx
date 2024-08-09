import { useStore } from '@/store';
import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

export default function WithAuthenticated({ children }: Props): React.ReactElement | null {
    const isSignedIn = useStore((state) => state.isSignedIn);

    return isSignedIn ? <>{children}</> : <Navigate to="/" />;
}
