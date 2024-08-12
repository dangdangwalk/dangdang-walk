"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    IsWGS84: function() {
        return IsWGS84;
    },
    IsWGS84Constraint: function() {
        return IsWGS84Constraint;
    }
});
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let IsWGS84Constraint = class IsWGS84Constraint {
    checkWGS84Range(coord, type) {
        if (type == 'lat') {
            return coord >= -90 && coord <= 90;
        } else {
            return coord >= -180 && coord <= 180;
        }
    }
    isValidateCoordinate(coord, type) {
        if (typeof coord !== 'number' || !this.regexWgs84.test(coord.toString())) {
            return false;
        }
        return this.checkWGS84Range(coord, type);
    }
    validate(value) {
        if (!Array.isArray(value)) {
            return false;
        }
        for (const cur of value){
            if (!Array.isArray(cur) || cur.length !== 2) {
                return false;
            }
            return this.isValidateCoordinate(cur[0], 'lat') && this.isValidateCoordinate(cur[1], 'lng');
        }
        return true;
    }
    defaultMessage(validationArguments) {
        if (validationArguments) {
            for (const cur of validationArguments.value){
                if (typeof cur[0] !== 'number' || typeof cur[1] !== 'number') {
                    return '요소의 타입이 number가 아닙니다';
                }
                if (!this.checkWGS84Range(cur[0], 'lat') || !this.checkWGS84Range(cur[1], 'lng')) {
                    return 'WGS84 범위를 벗어나는 숫자입니다. lat : -90 ~ 90, lng: -180 ~ 180';
                }
            }
        }
        return 'WGS84 포맷을 따르는 number로 이루어진 길이 2의 배열이어야 합니다';
    }
    constructor(){
        this.regexWgs84 = /^-?\d+\.*\d*/;
    }
};
IsWGS84Constraint = _ts_decorate([
    (0, _classvalidator.ValidatorConstraint)({
        async: false
    })
], IsWGS84Constraint);
function IsWGS84(validationOptions) {
    return function(object, propertyName) {
        (0, _classvalidator.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsWGS84Constraint
        });
    };
}

//# sourceMappingURL=WGS84.validator.js.map