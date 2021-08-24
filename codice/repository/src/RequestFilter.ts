export abstract class RequestFilter {
}

export class BaseRequestFilter extends RequestFilter{
    [key: string]: any
    order?: {
        [key: string]: 1|-1
    }
    fields?: string[]
    pagination?: {
        elements_num: number
        page_num: number
    }

    constructor(filter: {[key: string]: any}) {
        super()
        // assign to "this" just the required fields
        for(const key in filter) {
            if( Object.keys(BaseRequestFilterFields).includes(key)){
                this[key] = filter[key]
            }
        }
    }
}

export class TypedRequestFilter extends BaseRequestFilter {
    type?: string

    constructor(filter: Partial<TypedRequestFilter>) {
        let dup = {...filter}
        // remove type from the object that will be passed to super()
        for(const key in TypedRequestFilterFields) {
            if (dup[key]) {
                delete dup[key]
            }
        }
        super(dup)

        // assign to "this" just the required fields
        for (const key in filter) {
            if (Object.keys(TypedRequestFilterFields).includes(key)) {
                this[key] = filter[key]
            }
        }
    }
}

export enum BaseRequestFilterFields {
    order = 'order',
    fields = 'fields',
    pagination = 'pagination'
}

export enum TypedRequestFilterFields {
    type = 'type'
}