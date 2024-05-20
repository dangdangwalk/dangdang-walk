import CustomCalendar from '@/components/journals/CustomCalendar';
import JournalCardList from '@/components/journals/JournalCardList';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants/style';
import useJournals from '@/hooks/useJournals';
import { Dog } from '@/models/dog.model';

const dog: Dog = {
    id: 1,
    name: '테스트',
    profilePhotoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg',
};

export default function Journals() {
    const { journals } = useJournals();

    return (
        <>
            <header></header>
            <main
                className="flex flex-col bg-neutral-50 mb-[60px] min-h-dvh"
                style={{ minHeight: `calc(100dvh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT}  )` }}
            >
                <CustomCalendar />
                <JournalCardList journals={journals} dog={dog} />
            </main>
        </>
    );
}
