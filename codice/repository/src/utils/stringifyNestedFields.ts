export const stringifyNestedFields = (obj: any): {[key: string]: string} => {
    var converted_obj = {...obj};
    for(let field in converted_obj){
        converted_obj[field] = JSON.stringify(converted_obj[field]);
    }
    return converted_obj
}