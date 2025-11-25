import { DatabaseError } from "../database/DatabaseError"


export class NotFoundError extends DatabaseError {
    constructor(message: string) {
        super(message)
        this.name = 'NotFoundError'
    }
}
