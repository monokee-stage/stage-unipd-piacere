export const checkScopes = (url: string, method: string, owned_scopes: string[]): boolean => {
    const scopesFilePath: string = (process.cwd() + process.env.SCOPES_URLS_MAP_FILE_PATH) || ''
    const scopesMap: any = require(scopesFilePath)

    let matched: boolean = false
    owned_scopes.every((owned_scope) => {
        const scopeData: any = scopesMap[owned_scope]

        if (scopeData) {
            let methodMatch = false;
            let match = method.match(scopeData.method)
            // check that scopeData.method is contained in method and that the matched part coincides with the input
            if (match && match.length > 0 && match[0] === method) {
                methodMatch = true
            }else{
                // remain in the loop
                return true
            }
            let urlMatch = false;
            match = url.match(scopeData.url)
            // check that scopeData.url is contained in url and that the matched part coincides with the input
            if (match && match.length > 0 && match[0] === url) {
                urlMatch = true
            }else {
                // remain in the loop
                return true
            }
            if(methodMatch === true && urlMatch === true){
                matched = true
                // exit the loop
                return false
            }
        }
    })
    return matched
}