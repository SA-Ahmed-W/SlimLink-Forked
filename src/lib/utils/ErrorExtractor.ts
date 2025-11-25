export class ErrorExtractor {
    static getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message
        }
        if (typeof error === 'string') {
            return error
        }
        if (typeof error === 'object' && error !== null && 'message' in error) {
            return String(error.message)
        }
        return String(error)
    }

    static getErrorCode(error: unknown): string | undefined {
        if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
            return error.code
        }
        return undefined
    }

    static getErrorDetail(error: unknown): string | undefined {
        if (typeof error === 'object' && error !== null && 'detail' in error && typeof error.detail === 'string') {
            return error.detail
        }
        return undefined
    }
}
