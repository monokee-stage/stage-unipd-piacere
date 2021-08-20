export class CodedError extends Error {
    status_code: number

    constructor(message: string, status_code = 500) {
        super(message)

        // approfondire il funzionamento di questo
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CodedError)
        }

        this.name = 'CodedError'
        this.status_code = status_code

        Object.setPrototypeOf(this, CodedError.prototype);
    }
}