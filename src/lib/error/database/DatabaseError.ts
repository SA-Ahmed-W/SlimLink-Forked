export class DatabaseError extends Error {
    constructor(
        message: string,
        public code?: string,
        public detail?: string
    ) {
        super(message)
        this.name = 'DatabaseError'
        Error.captureStackTrace(this, this.constructor)
    }
}
