import { TestApp } from './utils/testApp.util';

const clearTestData = async () => {
    const testApp = new TestApp();

    await testApp.start();

    try {
        await testApp.clearTestData();
    } catch (error) {
        console.error('Error during test data insertion:', error);
    } finally {
        await testApp.terminate();
    }
};

clearTestData();
