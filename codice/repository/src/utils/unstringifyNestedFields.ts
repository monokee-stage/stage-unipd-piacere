export const unstringifyNestedFields = (obj: {[key: string]: string}): any => {
    let converted_obj = { ...obj };
    for (let field in converted_obj) {
        if (converted_obj[field].charAt(0) === '{') {
            try {
                converted_obj[field] = JSON.parse(converted_obj[field]);
            } catch(err) {}
        }
    }
    return converted_obj
}