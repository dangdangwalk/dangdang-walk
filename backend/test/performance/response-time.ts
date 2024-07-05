import { exec } from 'node:child_process';

import { promisify } from 'node:util';

import { TestApp } from './utils/testApp.util';

const execPromisified = promisify(exec);

const runPostmanCollectionWithNewman = async (
    collectionId: string,
    requestOrFolderId: string,
    iterationCount: number,
): Promise<void> => {
    const command = `postman collection run ${collectionId} -i ${requestOrFolderId} -n ${iterationCount} --color on`;

    try {
        const { stdout, stderr } = await execPromisified(command, { encoding: 'utf8' });
        console.log('Postman collection executed successfully.');
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    } catch (error) {
        console.error(`Failed to execute Postman collection: ${error}`);
    }
};

const COLLECTION_ID = process.env.COLLECTION_ID!;
const REQUEST_OR_FOLDER_ID = process.env.REQUEST_OR_FOLDER_ID!;
const ITERATION_COUNT = parseInt(process.env.ITERATION_COUNT!);

const validateParameters = () => {
    if (!COLLECTION_ID) {
        throw new Error('COLLECTION_ID가 정의되지 않았습니다. .env.test 파일을 수정해주세요.');
    }
    if (!REQUEST_OR_FOLDER_ID) {
        throw new Error('REQUEST_OR_FOLDER_ID가 정의되지 않았습니다. .env.test 파일을 수정해주세요.');
    }
    if (isNaN(ITERATION_COUNT)) {
        throw new Error('ITERATION_COUNT가 정의되지 않았거나 유효한 숫자가 아닙니다. .env.test 파일을 수정해주세요.');
    }
};

const runResponseTimeTest = async () => {
    validateParameters();

    const testApp = new TestApp();

    await testApp.start();

    try {
        await runPostmanCollectionWithNewman(COLLECTION_ID, REQUEST_OR_FOLDER_ID, ITERATION_COUNT);
    } catch (error) {
        console.error('Error during test execution:', error);
    } finally {
        await testApp.terminate();
    }
};

runResponseTimeTest();
