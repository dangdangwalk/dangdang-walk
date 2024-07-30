import { JournalDetail, fetchJournal } from '@/api/journal';
import { queryKeys } from '@/constants';
import { useStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useJournal = (journalId: number) => {
    const isSignedIn = useStore((state) => state.isSignedIn);
    const [journal, setJournal] = useState<JournalDetail>({
        journalInfo: { id: 0, routes: [], memo: '', journalPhotos: [], excrementCount: [] },
        dogs: [],
    });
    const { data, isSuccess } = useQuery<JournalDetail>({
        queryKey: [queryKeys.JOURNAL, journalId],
        queryFn: () => fetchJournal(journalId),
        staleTime: 0,
        enabled: isSignedIn,
    });

    useEffect(() => {
        if (data) setJournal(data);
    }, [isSuccess]);

    return journal as JournalDetail;
};

export default useJournal;
