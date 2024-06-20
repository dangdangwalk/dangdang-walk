/**
 * 주어진 배열에 값이나 값의 배열이 존재하는지 확인합니다.
 *
 * 이 함수는 배열의 어떤 타입에도 작동할 수 있는 제네릭 함수입니다.
 * `targetArr` 매개변수를 통해 검색할 배열을 받고, `toFind` 매개변수를 통해 검색할 값이나 값의 배열을 받습니다.
 *
 * 함수는 [`toFind`가 `targetArr`에 존재하는지 여부, 존재하지 않는 값 배열]을 반환합니다.
 *
 * @template T - `targetArr`와 `toFind`의 요소 타입.
 * @param targetArr - 검색할 배열.
 * @param toFind - 검색할 값이나 값의 배열.
 * @returns [`toFind`가 `targetArr`에 존재하는지 여부, 존재하지 않는 값 배열]
 *
 **/
export function checkIfExistsInArr<T>(targetArr: T[], toFind: T | T[]): [boolean, T[]] {
    const toFindList = Array.isArray(toFind) ? toFind : [toFind];

    const notFound = toFindList.filter((cur) => !targetArr.includes(cur));

    return [notFound.length === 0, notFound];
}

/**
 * 주어진 배열의 각 요소에서 특정 속성을 선택하여 새로운 객체를 만듭니다.
 * 이때, 새로운 객체의 키로는 `targetAttributes` 배열의 값들이 사용되고,
 * 값으로는 `srcAttributes` 배열의 값들이 사용됩니다.
 * 생성된 객체들은 최종 결과 배열에 추가됩니다.
 *
 * @param {any[]} targetArr - 속성을 추출할 소스 배열입니다.
 * @param {(string|string[])} newAttributes - 결과 객체의 키로 사용할 속성 이름입니다.
 * 단일 문자열 또는 속성 이름의 배열을 받을 수 있습니다.
 * @param {(string|string[])} srcAttributes - 소스 배열의 각 요소에서 속성을 추출할 속성 이름입니다.
 * 단일 문자열 또는 속성 이름의 배열을 받을 수 있습니다.
 * @returns {any[]} 결과 객체들의 배열입니다.
 **/

export function makeSubObjectsArray(
    targetArr: any[],
    srcAttributes: string | string[],
    newAttributes?: string | string[],
): any[] {
    const resArr: any[] = [];
    newAttributes = newAttributes ?? srcAttributes;
    Array.isArray(srcAttributes) ? srcAttributes : [srcAttributes];
    Array.isArray(newAttributes) ? newAttributes : [newAttributes];

    if (srcAttributes.length != newAttributes.length) {
        throw new Error('srcAttributes와 targetAttributes의 길이가 다릅니다');
    }
    targetArr.map((cur) => {
        const obj: { [key: string]: any } = {};
        for (let i = 0; i < srcAttributes.length; i++) {
            obj[`${srcAttributes[i]}`] = cur[`${newAttributes[i]}`];
        }
        resArr.push(obj);
    });
    return resArr;
}

/**
 * 주어진 타겟 객체에서 지정된 속성만을 포함하는 새 객체를 생성합니다.
 *
 * @param target - 속성을 추출할 원본 객체입니다.
 * @param attributes - 새 객체에 포함할 속성 이름의 배열입니다.
 * @returns 타겟 객체에서 지정된 속성만을 포함하는 새 객체입니다.
 *
 */
export function makeSubObject(target: any, attributes: string[]): any {
    const resObj: { [key: string]: any } = {};
    for (let i = 0; i < attributes.length; i++) {
        resObj[`${attributes[i]}`] = target[`${attributes[i]}`];
    }
    return resObj;
}
