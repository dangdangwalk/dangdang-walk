import { useToastStore } from '@/store/toastStore';

export default function useToast() {
    const show = useToastStore((state) => state.show);

    return { show };
}
