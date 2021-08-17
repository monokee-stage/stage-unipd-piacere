import { Request } from 'express';
import { Filter } from 'repositories'

export const requestToFilter = (req: Request): Filter => {
    try {
        let filter: Filter = new Filter()
        // ordinamento
        let order = req.query.order
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
        let fields = req.query.fields
        if (fields) {
            if (typeof (fields) == typeof ('example_string')) {
                filter.fields = []
                filter.fields.push(fields as string)
            } else if (typeof (fields) == typeof (['a', 'b'])) {
                filter.fields = fields as string[]
            }
        }
        // tipo
        filter.type = req.query.type as string
        // paginazione
        // should consider accepting the presence of just page elements implying that the page number is 0
        if (req.query.page_num && req.query.elements_num) {
            let paginationObj = {
                page_num: +req.query.page_num,
                elements_num: +req.query.elements_num
            }
            filter.pagination = paginationObj
        }

        return filter
    } catch(err) {
        throw err
    }
}