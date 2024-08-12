export declare function checkIfExistsInArr<T>(targetArr: T[], toFind: T | T[]): [boolean, T[]];
export declare function makeSubObjectsArray(
    targetArr: any[],
    srcAttributes: string | string[],
    newAttributes?: string | string[],
): any[];
export declare function makeSubObject(target: any, attributes: string[]): any;
