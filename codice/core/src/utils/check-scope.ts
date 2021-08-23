export const checkScopes = (url: string, method: string, owned_scopes: string[]): boolean => {
    try {
        const scopesFilePath: string = process.env.SCOPES_URLS_MAP_FILE_PATH || ''
        const scopesMap: any = require(scopesFilePath)

        let matched: boolean = false
        owned_scopes.forEach((owned_scope) => {
            const scopeData: any = scopesMap[owned_scope]

            if (scopeData) {
                if (scopeData.method === method && url.match(scopeData.url)) {
                    matched = true
                }
            }
        })
        return matched
    } catch(err) {
        throw err
    }
}