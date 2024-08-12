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
 **/ "use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    checkIfExistsInArr: function() {
        return checkIfExistsInArr;
    },
    makeSubObject: function() {
        return makeSubObject;
    },
    makeSubObjectsArray: function() {
        return makeSubObjectsArray;
    }
});
function checkIfExistsInArr(targetArr, toFind) {
    const toFindList = Array.isArray(toFind) ? toFind : [
        toFind
    ];
    const notFound = toFindList.filter((cur)=>!targetArr.includes(cur));
    return [
        notFound.length === 0,
        notFound
    ];
}
function makeSubObjectsArray(targetArr, srcAttributes, newAttributes) {
    const resArr = [];
    newAttributes = newAttributes !== null && newAttributes !== void 0 ? newAttributes : srcAttributes;
    Array.isArray(srcAttributes) ? srcAttributes : [
        srcAttributes
    ];
    Array.isArray(newAttributes) ? newAttributes : [
        newAttributes
    ];
    if (srcAttributes.length != newAttributes.length) {
        throw new Error('srcAttributes와 targetAttributes의 길이가 다릅니다');
    }
    targetArr.map((cur)=>{
        const obj = {};
        for(let i = 0; i < srcAttributes.length; i++){
            obj[`${srcAttributes[i]}`] = cur[`${newAttributes[i]}`];
        }
        resArr.push(obj);
    });
    return resArr;
}
function makeSubObject(target, attributes) {
    const resObj = {};
    for(let i = 0; i < attributes.length; i++){
        resObj[`${attributes[i]}`] = target[`${attributes[i]}`];
    }
    return resObj;
}

//# sourceMappingURL=manipulate.util.js.map