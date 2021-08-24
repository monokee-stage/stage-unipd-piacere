export const unstringifyNestedFields = (obj: {[key: string]: string}): any => {
    try {
        let converted_obj = { ...obj };
        for (let field in converted_obj) {
            if (converted_obj[field].charAt(0) === '{') {
                try {
                    converted_obj[field] = JSON.parse(converted_obj[field]);
                } catch(err) {
                    // todo: controlla
                    converted_obj[field] = converted_obj[field]
                }
            }
        }
        return converted_obj
    } catch(err) {
        throw err
    }
}