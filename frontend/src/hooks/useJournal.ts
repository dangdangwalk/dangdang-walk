import { JournalDetail, fetchJournal } from '@/api/journal';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';

const useJournal = (journalId: number) => {
    const isSignedIn = useStore((state) => state.isSignedIn);
    const [journal, setJournal] = useState<JournalDetail>({
        journalInfo: { id: 0, routes: [], memo: '', photoUrls: [] },
        dogs: [],
    });

    useEffect(() => {
        if (isSignedIn) {
            const asyncFunction = async () => {
                const fetchedJournal = await fetchJournal(journalId);
                setJournal(fetchedJournal);
            };
            asyncFunction();
        }
    }, [isSignedIn]);

    return journal;
};

export default useJournal;
