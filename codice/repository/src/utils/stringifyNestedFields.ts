export const stringifyNestedFields = (obj: any): {[key: string]: string} => {
    // console.log('stringifyNestedFields')
    try {
        var converted_obj = { ...obj };
        // console.log(converted_obj)
        for (let field in converted_obj) {
            // console.log(typeof(converted_obj[field]))
            // console.log(field)
            if (typeof(converted_obj[field]) !== 'object') {
                
            } else {
                converted_obj[field] = JSON.stringify(converted_obj[field]);
            }
            
        }
        return converted_obj
    } catch(err) {
        throw err
    }
}