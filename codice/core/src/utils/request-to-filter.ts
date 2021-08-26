import { Request } from 'express';
import { RequestFilter, BaseRequestFilter, TypedRequestFilter } from 'repositories'
import { CodedError } from '../coded.error';

export const requestToFilter = (req: Request, filterType: 'BaseRequestFilter' | 'TypedRequestFilter' = 'BaseRequestFilter'): BaseRequestFilter => {
    let filter: BaseRequestFilter
    if(filterType === 'BaseRequestFilter') {
        filter = new BaseRequestFilter()
    }else {
        filter = new TypedRequestFilter()
    }

    // ordinamento
    const order: any = req.query.sort
    if (order) {
        let orderArr: string[] = []
        if (typeof (order) === 'string') {
            orderArr = order.split(',')
        } else if (typeof (order) === 'object') {
            order.forEach((item: string, index: number) => {
                item.split(',').forEach((s: string) => {
                    orderArr.push(s)
                })
            })
        }

        if (orderArr.length > 0) {
            orderArr.forEach((item) => {
                if (item[0] === '-') {
                    filter.setSorting(item.split('-')[1], -1)
                } else {
                    filter.setSorting(item, +1)
                }
            })
        }
    }
    // campi
    const fields: any = req.query.fields
    let fieldsArr: string[] = []
    if (typeof (fields) === 'string') {
        fieldsArr = fields.split(',')
    } else if (typeof (fields) === 'object') {
        fields.forEach((item: string, index: number) => {
            item.split(',').forEach((s: string) => {
                fieldsArr.push(s)
            })
        })
    }
    if (fieldsArr.length > 0) {
        fieldsArr.forEach((item) => {
            try {
                if (item[0] === '-') {
                    filter.setFieldProjection(item.split('-')[1], false)
                } else {
                    filter.setFieldProjection(item, true)
                }
            } catch(err) {
                throw new CodedError('Opposite inclusion types on different items not permitted', 400)
            }
        })
    }
    

    // paginazione
    // accepting the presence of just "elements_num", implying that the page number is 0
    if (req.query.size) {
        
        let pageNum: number = +(req.query.page || '0')
        let page: number = pageNum >= 0 ? pageNum : 0
        let size: number = +(req.query.size || '0');
        filter.setPagination(page, size)

    }

    // tipo
    if (filterType === 'TypedRequestFilter' && req.query.type) {
        
        (filter as TypedRequestFilter).setType(req.query.type as string)
    }

    

    if (filterType === 'TypedRequestFilter') {
        return new TypedRequestFilter(filter);
    } else {
        return new BaseRequestFilter(filter);
    }
}