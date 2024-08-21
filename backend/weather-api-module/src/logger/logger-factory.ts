import { WinstonLoggerService } from "./winston-logger";

const logger = new WinstonLoggerService();

Object.freeze(logger);

export function getLogger() {
    return logger;
}
