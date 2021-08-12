export const checkScopes = (url: string, method: string, owned_scopes: string[]): boolean => {

    var scopesFilePath = process.env.SCOPES_URLS_MAP_FILE_PATH || ''
    var scopesMap = require(scopesFilePath)

    var matched = false
    owned_scopes.forEach((owned_scope) => {
        console.log(owned_scope)
        let scopeData = scopesMap[owned_scope]
        
        if(scopeData){
            console.log(scopeData.url)
            if(scopeData.method === method && url.match(scopeData.url)) {
                console.log('matched')
                matched = true
            }
        }
    })
    return matched
}