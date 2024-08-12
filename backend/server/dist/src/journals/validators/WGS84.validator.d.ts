import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsWGS84Constraint implements ValidatorConstraintInterface {
    private regexWgs84;
    private checkWGS84Range;
    private isValidateCoordinate;
    validate(value: [number, number][]): boolean;
    defaultMessage(validationArguments?: ValidationArguments | undefined): string;
}
export declare function IsWGS84(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
