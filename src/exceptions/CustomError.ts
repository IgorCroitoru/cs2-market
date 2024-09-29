export enum ERR {
    GeneralError= 0,
    PrivateProfile = 1,
    BadTradeUrl = 2,
    InvalidItems = 3,
    Escrow = 4,
    AccessDenied= 5,
    NotReady = 6,
    RateLimitExceeded = 7,
    TargetCannotTrade = 8,
    TradeBan = 9,
    ItemServerUnavailable = 10
    
    // Add other EResult values as needed
}

export const EResultStatusCodes: { [key in ERR]: number } = {
    [ERR.PrivateProfile]: 403,
    [ERR.BadTradeUrl]: 400,
    [ERR.GeneralError]: 500,
    [ERR.InvalidItems]: 500,
    [ERR.Escrow]: 500,
    [ERR.AccessDenied]: 500,
    [ERR.NotReady]: 500,
    [ERR.RateLimitExceeded]: 429,
    [ERR.TargetCannotTrade] : 400,
    [ERR.TradeBan] : 400,
    [ERR.ItemServerUnavailable] : 500
    // Add other mappings as needed
};

export class CustomError extends Error {
    eresult?: ERR;
    statusCode: number;

    constructor(message: string, eresult?: ERR) {
        const statusCode = eresult !== undefined ? EResultStatusCodes[eresult] : 500;
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.eresult = eresult;

        // Ensure the name of this error is the same as the class name
        Object.setPrototypeOf(this, new.target.prototype);

        // Capturing stack trace, excluding constructor call from it
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static typeOf(error: any): error is CustomError {
        return (
            error &&
            typeof error === 'object' &&
            'statusCode' in error &&
            typeof error.statusCode === 'number' && // Check if statusCode is a number
            'message' in error &&
            typeof error.message === 'string' && // Check if message is a string
            (error.eresult === undefined || typeof error.eresult === 'number') // Check if eresult is a number or undefined
        );
    }

    toJSON() {
        return {
            message: this.message,
            eresult: this.eresult,
            statusCode: this.statusCode
        };
    }
}
