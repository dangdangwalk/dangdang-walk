export class PublicWeatherAPIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class XMLParseError extends PublicWeatherAPIError {
    constructor(message: string) {
        super(message);
    }
}

export class NoDataError extends PublicWeatherAPIError {
    constructor(message: string) {
        super(message);
    }
}
