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
 * 주어진 대상 배열에서 특정 속성을 선택하여 객체 배열을 생성합니다.
 *
 * 이 함수는 `targetArr`를 반복하고 각 요소에 대해 새 객체를 생성합니다.
 *  결과 객체는 새 배열로 수집되어 반환됩니다.
 *
 * @param targetArr - 속성을 추출할 원본 배열입니다.
 * @param attributes - `targetArr`의 각 객체에서 선택할 속성입니다.
 *   이 매개변수는 문자열(속성 이름) 또는 문자열 배열이 될 수 있습니다.
 *   `attributes`가 배열인 경우, 이 배열에 속한 모든 속성을 포함합니다.
 *   `attributes`가 문자열인 경우, 주어진 이름의 속성 하나를 선택합니다.
 * @returns `targetArr`의 각 객체에서 지정된 속성만 포함하는 객체의 배열을 반환합니다.
 *
 * @example
 * const targetArray = [
 *   { id: 1, name: 'Alice', age: 30 },
 *   { id: 2, name: 'Bob', age: 25 }
 * ];
 * const attributes = ['id', 'name'];
 * const result = makeSubObjectsArray(targetArray, attributes);
 * console.log(result);
 * // 출력: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 */
export function makeSubObjectsArray(targetArr: any[], attributes: string | string[]): any[] {
    const resArr: any[] = [];
    if (Array.isArray(attributes)) {
        targetArr.map((cur) => {
            {
                const obj: { [key: string]: any } = {};
                for (let i = 0; i < attributes.length; i++) {
                    obj[`${attributes[i]}`] = cur[`${attributes[i]}`];
                }
                resArr.push(obj);
            }
        });
    } else {
        targetArr.map((cur) => {
            const obj: { [key: string]: any } = {};
            obj[`${attributes}`] = cur[`${attributes}`];
            resArr.push(obj);
        });
    }
    return resArr;
}