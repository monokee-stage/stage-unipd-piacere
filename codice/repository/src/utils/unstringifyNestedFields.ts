export const unstringifyNestedFileds = (obj: any): any => {
    var converted_obj = {...obj};
    for(let field in converted_obj){
        console.log(converted_obj[field])
        if(converted_obj[field].charAt(0) == '{'){
            converted_obj[field] = JSON.parse(converted_obj[field]);
        }
        
    }
    return converted_obj
}