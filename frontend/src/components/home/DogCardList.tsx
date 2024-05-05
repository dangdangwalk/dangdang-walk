import DogCard from '@/components/home/DogCard';

const dogs = [
    {
        id: 1, // 강아지 id
        name: '덕지', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg', // 강아지 사진
        recommendedDailyWalkAmount: 3600, //하루 권장 산책량,
        dailyWalkAmount: 3600, //하루 산책량
        weeklyWalks: [0, 1, 2, 0, 0, 0, 1], // 한 주간 산책 체크
    },
    {
        id: 2, // 강아지 id
        name: '철도', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/002.jpg', // 강아지 사진
        recommendedDailyWalkAmount: 12600, //하루 권장 산책량,
        dailyWalkAmount: 3600, //하루 산책량
        weeklyWalks: [0, 1, 0, 1, 1, 0, 1], // 한 주간 산책 체크
    },
    {
        id: 3, // 강아지 id
        name: '', //강아지 이름
        photoUrl: '', // 강아지 사진
        recommendedDailyWalkAmount: 12600, //하루 권장 산책량,
        dailyWalkAmount: 0, //하루 산책량
        weeklyWalks: [0, 1, 0, 1, 1, 0, 1], // 한 주간 산책 체크
    },
];
export default function DogCardList() {
    return (
        <div className="flex py-6 gap-4 justify-start flex-col">
            {dogs.map((dog) => {
                return <DogCard key={dog.id} dog={dog} />;
            })}
        </div>
    );
}
