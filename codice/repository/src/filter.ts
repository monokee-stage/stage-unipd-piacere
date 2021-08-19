export class RequestFilter {
    order?: {
        [key: string]: 1|-1
    }
    type?: string
    fields?: string[]
    pagination?: {
        elements_num: number
        page_num: number
    }
}