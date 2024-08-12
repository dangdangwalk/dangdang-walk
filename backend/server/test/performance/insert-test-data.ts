import { TestApp } from './utils/testApp.util';

const DATA_SIZE = parseInt(process.env.DATA_SIZE!);

const insertTestData = async () => {
    if (isNaN(DATA_SIZE)) {
        throw new Error('DATA_SIZE가 정의되지 않았거나 유효한 숫자가 아닙니다. .env.test 파일을 수정해주세요.');
    }

    const testApp = new TestApp();

    await testApp.start();

    try {
        await testApp.clearTestData({ keepSeedData: true });
        await testApp.insertTestData(DATA_SIZE);
    } catch (error) {
        console.error('Error during test data insertion:', error);
    } finally {
        await testApp.terminate();
    }
};

insertTestData();
