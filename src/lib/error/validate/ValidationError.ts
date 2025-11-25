import { DatabaseError } from '../database/DatabaseError'
export class ValidationError extends DatabaseError {
    constructor(message: string) {
        super(message)
        this.name = 'ValidationError'
    }
}
