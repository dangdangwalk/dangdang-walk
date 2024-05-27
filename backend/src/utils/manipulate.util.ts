/**
 * 주어진 배열에 값이나 값의 배열이 존재하는지 확인합니다.
 *
 * 이 함수는 배열의 어떤 타입에도 작동할 수 있는 제네릭 함수입니다.
 * * `targetArr`라는 매개변수를 통해 검색할 배열을, `toFind`라는 매개변수를 통해 검색할 값이나 값의 배열을 받습니다.
 *
 * `toFind`가 배열인 경우, 함수는 `toFind`의 모든 요소가 `targetArr`에 포함되어 있는지 확인합니다.
 * `toFind`가 단일 값인 경우, 함수는 `toFind`가 `targetArr`에 포함되어 있는지 확인합니다.
 *
 * 조건이 충족되면 `true`, 그렇지 않으면 `false`를 반환합니다.
 *
 * @template T - `targetArr`와 `toFind`의 요소 타입.
 * @param targetArr - 검색할 배열.
 * @param toFind - 검색할 값이나 값의 배열.
 * @returns `toFind`가 `targetArr`에 존재하면 `true`, 그렇지 않으면 `false`.
 *
 **/
export function checkIfExistsInArr<T>(targetArr: T[], toFind: T | T[]): boolean {
    return Array.isArray(toFind) ? toFind.every((cur) => targetArr.includes(cur)) : targetArr.includes(toFind);
}

/**
 * 주어진 배열의 각 요소에서 특정 속성을 선택하여 새로운 객체를 만듭니다.
 * 이때, 새로운 객체의 키로는 `targetAttributes` 배열의 값들이 사용되고,
 * 값으로는 `srcAttributes` 배열의 값들이 사용됩니다.
 * 생성된 객체들은 최종 결과 배열에 추가됩니다.
 *
 * @param {any[]} targetArr - 속성을 추출할 소스 배열입니다.
 * @param {(string|string[])} targetAttributes - 결과 객체의 키로 사용할 속성 이름입니다.
 * 단일 문자열 또는 속성 이름의 배열을 받을 수 있습니다.
 * @param {(string|string[])} srcAttributes - 소스 배열의 각 요소에서 속성을 추출할 속성 이름입니다.
 * 단일 문자열 또는 속성 이름의 배열을 받을 수 있습니다.
 * @returns {any[]} 결과 객체들의 배열입니다.
 *
 * @example
 * const data = [
 *     { id: 1, name: 'Alice', age: 30 },
 *     { id: 2, name: 'Bob', age: 25 }
 * ];
 * const targetAttrs = ['name'];
 * const srcAttrs = ['age'];
 * const result = makeSubObjectsArray(data, targetAttrs, srcAttrs);
 * console.log(result);
 * // 출력:
 * // [
 * //     { name: 30 },
 * //     { name: 25 }
 * // ]
 */

export function makeSubObjectsArray(
    targetArr: any[],
    srcAttributes: string | string[],
    targetAttributes?: string | string[]
): any[] {
    const resArr: any[] = [];
    targetAttributes = targetAttributes ?? srcAttributes;
    Array.isArray(srcAttributes) ? srcAttributes : [srcAttributes];
    Array.isArray(targetAttributes) ? targetAttributes : [targetAttributes];
    if (srcAttributes.length != targetAttributes.length) {
        throw new Error('srcAttributes and targetAttributes must have same length');
    }
    targetArr.map((cur) => {
        const obj: { [key: string]: any } = {};
        for (let i = 0; i < srcAttributes.length; i++) {
            obj[`${targetAttributes[i]}`] = cur[`${srcAttributes[i]}`];
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
