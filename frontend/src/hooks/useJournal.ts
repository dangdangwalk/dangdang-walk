import { JournalDetail, fetchJournal } from '@/api/journal';
import { useEffect, useState } from 'react';

const useJournal = (journalId: number) => {
    const [journal, setJournal] = useState<JournalDetail>({
        journalInfo: { id: 0, routes: [], memo: '', photoUrls: [] },
        dogs: [],
    });

    useEffect(() => {
        const asyncFunction = async () => {
            const fetchedJournal = await fetchJournal(journalId);
            setJournal(fetchedJournal);
        };
        asyncFunction();
    }, []);

    return journal;
};

export default useJournal;
