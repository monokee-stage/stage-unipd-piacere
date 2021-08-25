import { Filter, FindOptions, Collection, UpdateFilter, UpdateResult, Document} from "mongodb"

export const controlledMongoUpdateOne = async (collection: Collection, filter: any, updateFilter: any): Promise<Document | UpdateResult> => {
    return new Promise<Document | UpdateResult> (async (resolve, reject) => {
        try{
            let results = await collection.find<any>(filter).toArray()
            if (results.length > 1) {
                return reject(new Error('There are multiple candidates for this operation in the database'))
            } else {
                let results2: Document | UpdateResult = await collection.updateOne(filter, updateFilter)
                return resolve(results2)
            }
        } catch(err) {
            return reject(err)
        }
    })
    
}