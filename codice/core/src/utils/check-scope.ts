export const checkScopes = (url: string, method: string, owned_scopes: string[]): boolean => {

    var scopesFilePath = process.env.SCOPES_URLS_MAP_FILE_PATH || ''
    var scopesMap = require(scopesFilePath)

    var matched = false
    owned_scopes.forEach((owned_scope) => {
        let scopeData = scopesMap[owned_scope]
        
        if(scopeData){
            if(scopeData.method === method && url.match(scopeData.url)) {
                matched = true
            }
        }
    })
    return matched
}