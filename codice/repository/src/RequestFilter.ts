import { Timestamp } from "mongodb"

export abstract class RequestFilter {
}

export class BaseRequestFilter extends RequestFilter{
    [key: string]: any
    private order!: {
        [key: string]: 1|-1
    }
    private fields!: string[]
    private fieldsInclusion!: boolean|undefined
    private  pagination!: {
        page: number
        size: number
    }

    /*
    constructor(filter: {[key: string]: any}) {
        super()
        // assign to "this" just the required fields
        for(const key in filter) {
            if( Object.keys(BaseRequestFilterFields).includes(key)){
                this[key] = filter[key]
            }
        }
    }*/

    constructor(filter?: { [key: string]: any }) {
        super()
        if(filter) {
            // assign to "this" just the required fields
            for (const key in filter) {
                if (Object.keys(BaseRequestFilterFields).includes(key)) {
                    this[key] = filter[key]
                }
            }
        }else {
            this.order = {}
            this.fields = []
            this.fieldsInclusion = true
            this.pagination = {
                size: 0,
                page: 0
            }
        }
    }

    public setSorting(field: string, direction: 1|-1): void {
        this.order[field] = direction
    }

    public setFieldProjection(field: string, inclusion: boolean): void {
        console.log('this.fields')
        console.log(this.fields)
        if(this.fields.length === 0) {
            // if array empty add item and set the inclusion
            if(!this.fields.includes(field)){
                this.fields.push(field)
                this.fieldsInclusion = inclusion
            }
            
            console.log('this')
            console.log(this)
        }else {
            // if array is not empty you can add items maintaining the same inclusion type
            // and you can remove a previously added element
            // but you can't add new elements with a different inclusion type 
            if(inclusion !== this.fieldsInclusion) {
                if(this.fields.includes(field)){
                    // remove 'field'
                    this.fields = this.fields.filter((f) => {
                        return f !== field
                    })
                }else{
                    throw new Error('Opposite inclusion types on different items not permitted')
                }
            }else{
                if (!this.fields.includes(field)) {
                    this.fields.push(field)
                }
                
            }
        }
    }

    public setPagination(page: number, size: number) {
        this.pagination.page = page
        this.pagination.size = size
    }

    public getSorting(): {[key: string]: 1 | -1} {
        return this.order
    }
    public getFields(): string[] {
        return this.fields
    }
    public getFieldsInclusion(): boolean|undefined {
        return this.fieldsInclusion
    }
    public getPagination(): {page: number, size: number} {
        return this.pagination
    }

}

export class TypedRequestFilter extends BaseRequestFilter {
    private type!: string|undefined

    constructor(filter?: Partial<TypedRequestFilter>) {
        if(filter){
            let dup = { ...filter }
            // remove type from the object that will be passed to super()
            for (const key in TypedRequestFilterFields) {
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
        }else {
            super()
            this.type = undefined
        }
    }

    public setType(type: string) {
        this.type = type
    }
    public getType(): string|undefined {
        return this.type
    }


}

export enum BaseRequestFilterFields {
    order = 'order',
    fields = 'fields',
    fieldsInclusion = 'fieldsInclusion',
    pagination = 'pagination'
}

export enum TypedRequestFilterFields {
    type = 'type'
}