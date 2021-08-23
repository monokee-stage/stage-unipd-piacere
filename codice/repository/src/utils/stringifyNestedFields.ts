export const stringifyNestedFields = (obj: any): {[key: string]: string} => {

    try {
        let converted_obj = { ...obj };
        for (let field in converted_obj) {
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