import { Collection, FindCursor, Projection } from "mongodb";
import { BaseRequestFilter, BaseRequestFilterFields, RequestFilter, TypedRequestFilter } from "../RequestFilter";

// T must be the type of the elements in collection. It must not be an array of that type
export const applyQueryAndFilter = <T>(collection: Collection, query: any, filter?: BaseRequestFilter): FindCursor<T> => {
    console.log('filter: ')
    console.log(filter)
    if (!filter) {
        return collection.find<T>(query);
    }

    let match = query

    if (<TypedRequestFilter>filter) {
        let typedFilter: TypedRequestFilter = new TypedRequestFilter(filter)
        // tipo
        let type: string | undefined = typedFilter.getType()
        if (type) {
            match.type = type
        }
    }
    if (<BaseRequestFilter>filter) {
        // campi
        let projection: { [key: string]: 1 | 0 } = {}
        let fields: string[] = filter.getFields()
        let fieldsInclusion: boolean|undefined = filter.getFieldsInclusion()
        if (fields && fields.length > 0) {
            fields.forEach((item: string) => {
                projection[item] = fieldsInclusion === true ? 1 : 0
            })
            // the clients expects _id to not be shown but mongodb shows _id by default: so specify to not show it
            if (!fields.includes('_id') && fieldsInclusion === true) {
                projection['_id'] = 0
            }
        }
        

        let cursor: FindCursor<T> = collection.find<T>(match)
        if (projection) {
            console.log('projection')
            console.log(projection)
            cursor = cursor.project<T>(projection as Projection<T>)
        }
        // ordinamento
        let sorting = filter.getSorting()
        if (sorting && Object.keys(sorting).length > 0) {
            cursor = cursor.sort(sorting)
        }
        // paginazione
        let pagination = filter.getPagination()
        if (pagination) {
            console.log(pagination)

            cursor = cursor
                .skip(pagination.page * pagination.size)
                .limit(pagination.size)
        }

        return cursor
    } else {
        throw new Error('Filter not in the right format')
    }
}