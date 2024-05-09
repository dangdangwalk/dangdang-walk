/**
 * 주어진 배열에 값이나 값의 배열이 존재하는지 확인합니다.
 * 
 * 이 함수는 배열의 어떤 타입에도 작동할 수 있는 제네릭 함수입니다.
 * `targetArr`라는 매개변수를 통해 검색할 배열을, `toFind`라는 매개변수를 통해 검색할 값이나 값의 배열을 받습니다.
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
