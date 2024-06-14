import Spinner from '@/components/commons/Spinner';
import DogCardList from '@/components/home/DogCardList';
import RegisterCard from '@/components/home/RegisterCard';
import { DogAvatar, DogStatistic } from '@/models/dog';
import { isArrayNotEmpty } from '@/utils/validate';

export interface JournalsState {
    selectedDog?: DogAvatar;
    dogs?: DogAvatar[];
}

interface DogStatisticsViewProps {
    isPending: boolean;
    dogsStatistic: DogStatistic[] | undefined;
    pageMove: <T>(url: string, state: T) => void;
}

const DogStatisticsView = ({ isPending, dogsStatistic, pageMove }: DogStatisticsViewProps) => {
    const goToJournals = (dogId: number) => {
        const url = `/journals`;
        const state: JournalsState = { dogs: dogsStatistic, selectedDog: dogsStatistic?.find((d) => d.id === dogId) };
        pageMove(url, state);
    };

    if (isPending) {
        return <Spinner />;
    }
    return (
        <>
            {isArrayNotEmpty(dogsStatistic) ? (
                <DogCardList dogsStatistic={dogsStatistic} pageMove={goToJournals} />
            ) : (
                <RegisterCard pageMove={pageMove} />
            )}
        </>
    );
};

export default DogStatisticsView;
