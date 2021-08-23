import { Collection , FindCursor, Projection } from "mongodb";
import { BaseRequestFilter, RequestFilter, TypedRequestFilter } from "../RequestFilter";

// T must be the type of the elements in collection. It must not be an array of that type
export const applyQueryAndFilter = <T>(collection: Collection, query: any, filter?: RequestFilter): FindCursor<T> => {
    try {
        console.log('apply query and filter received filter')
        console.log(filter)
        if (!filter) {
            return collection.find<T>(query);
        }

        let match = query

        if(<TypedRequestFilter>filter) {
            let typedFilter: TypedRequestFilter = filter as TypedRequestFilter
            // tipo
            if (typedFilter.type) {
                match.type = typedFilter.type
            }
        }
        if(<BaseRequestFilter>filter) {
            let baseFilter: BaseRequestFilter = filter as BaseRequestFilter
            // campi
            let projection: { [key: string]: 1 | 0 } = {}
            if (baseFilter.fields) {
                baseFilter.fields.forEach((item) => {
                    projection[item] = 1
                })
                if (!baseFilter.fields.includes('_id')) {
                    projection._id = 0
                }
            }

            console.log('just before collection.find')
            let cursor: FindCursor<T> = collection.find<T>(match)
            console.log('just after collection.find')
            if (projection) {
                cursor = cursor.project<T>(projection as Projection<T>)
            }
            // ordinamento
            if (baseFilter.order) {
                cursor = cursor.sort(baseFilter.order)
            }
            // paginazione
            if (baseFilter.pagination) {
                console.log(baseFilter.pagination)

                cursor = cursor
                    .skip(baseFilter.pagination.page_num * baseFilter.pagination.elements_num)
                    .limit(baseFilter.pagination.elements_num)
            }

            return cursor
        }else {
            throw new Error('Filter not in the right format')
        }

    } catch(err) {
        throw err
    }
}