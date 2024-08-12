"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSubObject = exports.makeSubObjectsArray = exports.checkIfExistsInArr = void 0;
function checkIfExistsInArr(targetArr, toFind) {
    const toFindList = Array.isArray(toFind) ? toFind : [toFind];
    const notFound = toFindList.filter((cur) => !targetArr.includes(cur));
    return [notFound.length === 0, notFound];
}
exports.checkIfExistsInArr = checkIfExistsInArr;
function makeSubObjectsArray(targetArr, srcAttributes, newAttributes) {
    const resArr = [];
    newAttributes = newAttributes ?? srcAttributes;
    Array.isArray(srcAttributes) ? srcAttributes : [srcAttributes];
    Array.isArray(newAttributes) ? newAttributes : [newAttributes];
    if (srcAttributes.length != newAttributes.length) {
        throw new Error('srcAttributes와 targetAttributes의 길이가 다릅니다');
    }
    targetArr.map((cur) => {
        const obj = {};
        for (let i = 0; i < srcAttributes.length; i++) {
            obj[`${srcAttributes[i]}`] = cur[`${newAttributes[i]}`];
        }
        resArr.push(obj);
    });
    return resArr;
}
exports.makeSubObjectsArray = makeSubObjectsArray;
function makeSubObject(target, attributes) {
    const resObj = {};
    for (let i = 0; i < attributes.length; i++) {
        resObj[`${attributes[i]}`] = target[`${attributes[i]}`];
    }
    return resObj;
}
exports.makeSubObject = makeSubObject;
//# sourceMappingURL=manipulate.util.js.map