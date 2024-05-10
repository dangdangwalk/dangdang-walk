import { Dog } from '@/models/dog.model';

interface WalkingDog extends Dog {
    isUrineChecked: boolean;
    isFeceChecked: boolean;
}
const dogs: WalkingDog[] = [
    {
        id: 1, // 강아지 id
        name: '덕지', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg', // 강아지 사진
        isUrineChecked: false,
        isFeceChecked: false,
    },
    {
        id: 2, // 강아지 id
        name: '철도', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/002.jpg', // 강아지 사진
        isUrineChecked: false,
        isFeceChecked: false,
    },
    {
        id: 3, // 강아지 id
        name: '', //강아지 이름
        photoUrl: '', // 강아지 사진
        isUrineChecked: false,
        isFeceChecked: false,
    },
];

const useWalkingDogs = () => {
    return { walkingDogs: dogs };
};

export default useWalkingDogs;
