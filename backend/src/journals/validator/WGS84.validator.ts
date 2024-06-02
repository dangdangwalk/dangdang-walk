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
    validate(point: string, validationArguments?: ValidationArguments | undefined): boolean {
        return this.regexWgs84.test(point);
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
