import { Collection, FindCursor } from "mongodb";
import { Filter } from "../filter";

// should fix this function as a generic, and not by returning ...<any>
export const applyQueryAndFilter = (collection: Collection, query: any, filter?: Filter): FindCursor<any> => {
    console.log('apply query and filter received filter')
    console.log(filter)
    if(!filter){
        return collection.find(query);
    }
    // tipo
    let match = query
    if(filter.type){
        match.type = filter.type
    }
    // campi
    let projection: {[key: string]: 1|0} = {}
    if(filter.fields) {
        filter.fields.forEach((item) => {
            projection[item] = 1
        })
        if(!filter.fields.includes('_id')){
            projection._id = 0
        }
    }


    let cursor = collection.find(match)
    if(projection) {
        cursor = cursor.project(projection)
    }
    if(filter.order) {
        cursor = cursor.sort(filter.order)
    }
    if(filter.pagination) {
        console.log(filter.pagination)
        
        cursor = cursor
                .skip(filter.pagination.page_num * filter.pagination.elements_num)
                .limit(filter.pagination.elements_num)
    }

    return cursor
}