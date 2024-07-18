import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsWGS84Constraint implements ValidatorConstraintInterface {
    private regexWgs84 = /^-?\d+\.*\d*/;

    private checkWGS84Range(coord: number, type: 'lat' | 'lng'): boolean {
        if (type == 'lat') {
            return coord >= -90 && coord <= 90;
        } else {
            return coord >= -180 && coord <= 180;
        }
    }

    private isValidateCoordinate(coord: number, type: 'lat' | 'lng'): boolean {
        if (typeof coord !== 'number' || !this.regexWgs84.test(coord.toString())) {
            return false;
        }

        return this.checkWGS84Range(coord, type);
    }

    validate(value: [number, number][]): boolean {
        if (!Array.isArray(value)) {
            return false;
        }

        for (const cur of value) {
            if (!Array.isArray(cur) || cur.length !== 2) {
                return false;
            }
            return this.isValidateCoordinate(cur[0], 'lat') && this.isValidateCoordinate(cur[1], 'lng');
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments | undefined): string {
        if (validationArguments) {
            for (const cur of validationArguments.value) {
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
}

export function IsWGS84(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsWGS84Constraint,
        });
    };
}
