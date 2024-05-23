const KM: number = 1000;
export default class Distance {
    private _value: number;

    constructor(value: number) {
        this._value = Math.round(value);
    }

    get value(): number {
        return this._value;
    }
    set value(value: number) {
        this._value = value;
    }
    get unit() {
        return this._value >= 1000 ? 'km' : 'm';
    }
    toKm(value: number) {
        return (value / 1000).toFixed(2);
    }
    get formatedDistance(): string {
        return this._value >= KM ? this.toKm(this._value) : String(this._value);
    }
    get valueWithUnit() {
        return `${this.formatedDistance} ${this.unit}`;
    }
}
