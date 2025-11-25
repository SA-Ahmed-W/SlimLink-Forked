export class UrlHelper {
    // Regex options
    static URL_REGEX_LOOSE = /https?:\/\/\S+/i

    static URL_REGEX_COMMON = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,10}\b[-a-zA-Z0-9()@:%_+.~#?&//=]*$/i

    static URL_REGEX_STRICT = /^https?:\/\/(([\w-]+\.)+[a-zA-Z]{2,})(:[0-9]{1,5})?(\/.*)?$/i

    static URL_REGEX_RFCish = /^(https?):\/\/([^\s:@]+(:[^\s:@]+)?@)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d{2,5})?(\/[^\s]*)?$/i

    static URL_REGEX_INTERNAL = /^(https?):\/\/([\w.-]+)(:\d{2,5})?(\/.*)?$/i

    static URL_REGEX_IPV4 = /^https?:\/\/((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3})(:\d{2,5})?(\/.*)?$/i

    // Default validator
    static URL_REGEX = UrlHelper.URL_REGEX_COMMON

    static isValidUrl(url: string): boolean {
        if (!url) return false
        return this.URL_REGEX.test(url.trim())
    }

    static isValidStrict(url: string): boolean {
        if (!url) return false
        return this.URL_REGEX_STRICT.test(url.trim())
    }

    static isValidIPv4(url: string): boolean {
        if (!url) return false
        return this.URL_REGEX_IPV4.test(url.trim())
    }

    static isValidWithURL(url: string): boolean {
        if (!url) return false
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    static tryParse(url: string): URL | null {
        if (!url) return null
        try {
            return new URL(url.trim())
        } catch {
            return null
        }
    }

    static getHostname(url: string): string | null {
        const parsed = this.tryParse(url)
        return parsed ? parsed.hostname : null
    }

    static getProtocol(url: string): string | null {
        const parsed = this.tryParse(url)
        return parsed ? parsed.protocol.replace(':', '') : null
    }

    static getQueryParams(url: string): Record<string, string> | null {
        const parsed = this.tryParse(url)
        if (!parsed) return null

        const params: Record<string, string> = {}
        parsed.searchParams.forEach((value, key) => {
            params[key] = value
        })
        return params
    }

    static normalize(url: string): string | null {
        const parsed = this.tryParse(url)
        return parsed ? parsed.toString() : null
    }
}
