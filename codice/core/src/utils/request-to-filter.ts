import { Request } from 'express';
import { RequestFilter, BaseRequestFilter, TypedRequestFilter } from 'repositories'

export const requestToFilter = (req: Request, filterType: 'BaseRequestFilter' | 'TypedRequestFilter' = 'BaseRequestFilter'): RequestFilter => {
    try {
        let filter: any = {}
        // ordinamento
        const order: any = req.query.order
        if (order) {
            let orderArr: string[] = []
            if (typeof (order) == typeof ('example_string')) {
                orderArr.push(order as string)
            } else if (typeof (order) == typeof (['a', 'b'])) {
                orderArr = order as string[]
            }
            if (orderArr.length > 0) {
                let orderObj: { [key: string]: any } = {}
                orderArr.forEach((item) => {
                    if (item[0] == '-') {
                        orderObj[item.split('-')[1]] = -1
                    } else {
                        orderObj[item] = 1
                    }
                })
                filter.order = orderObj
            }
        }
        // campi
        // todo: accetta campi da non mostrare
        const fields: any = req.query.fields
        if (fields) {
            if (typeof (fields) == typeof ('example_string')) {
                filter.fields = []
                filter.fields.push(fields as string)
            } else if (typeof (fields) == typeof (['a', 'b'])) {
                filter.fields = fields as string[]
            }
        }
        if (filterType === 'TypedRequestFilter' && req.query.type){
            // tipo
            filter.type = req.query.type as string
        }
        
        // paginazione
        // accepting the presence of just "elements_num", implying that the page number is 0
        if (req.query.elements_num) {
            let pageNum: number = +(req.query.page_num || '0')
            let paginationObj = {
                page_num: pageNum >= 0 ? pageNum : 0,
                elements_num: +req.query.elements_num
            }
            filter.pagination = paginationObj
        }

        if (filterType === 'TypedRequestFilter') {
            return new TypedRequestFilter(filter);
        }else {
            return new BaseRequestFilter(filter);
        }
    } catch(err) {
        throw err
    }
}