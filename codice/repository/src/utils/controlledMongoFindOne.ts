import { Filter, FindOptions, Collection} from "mongodb"

export const controlledMongoFindOne = async <T>(collection: Collection,  filter: Filter<T>, options?: FindOptions): Promise<T | undefined> => {
    return new Promise<T | undefined> (async (resolve, reject) => {
        try {
            let results = await collection.find<T>(filter, options).toArray()
            if(results.length > 1){
                return reject({error: 'There are multiple candidates for this operation in the database'})
            }else if(results.length === 1){
                return resolve(results[0])
            }else {
                return resolve(undefined)
            }
        } catch (err) {
            return reject(err)
        }
    })
    
}