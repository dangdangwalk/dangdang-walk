import { useStore } from '@/store';

export default function useToast() {
    const show = useStore((state) => state.show);

    return { show };
}
