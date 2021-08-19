export abstract class RequestFilter {
}

// the Object.assing in BaseRequestFilter assigns "type" also, so the Object.assign in TypedRequestFilter it's useless -> fix
export class BaseRequestFilter extends RequestFilter{
    order?: {
        [key: string]: 1|-1
    }
    fields?: string[]
    pagination?: {
        elements_num: number
        page_num: number
    }

    constructor(filter: Partial<BaseRequestFilter>) {
        super()
        Object.assign(this, filter)
    }
}

export class TypedRequestFilter extends BaseRequestFilter {
    type?: string

    constructor(filter: Partial<TypedRequestFilter>) {
        super(filter)
        Object.assign(this, filter)
    }
}