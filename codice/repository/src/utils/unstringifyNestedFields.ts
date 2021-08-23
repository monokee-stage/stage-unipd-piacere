export const unstringifyNestedFields = (obj: any): any => {
    try {
        let converted_obj = { ...obj };
        for (let field in converted_obj) {
            // console.log(converted_obj[field])
            if (converted_obj[field].charAt(0) === '{') {
                try {
                    converted_obj[field] = JSON.parse(converted_obj[field]);
                } catch(err) {
                    converted_obj[field] = converted_obj[field]
                }
            }
        }
        return converted_obj
    } catch(err) {
        throw err
    }
}