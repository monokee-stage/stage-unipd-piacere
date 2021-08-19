import { inject, injectable } from "inversify";
import { TYPES, MetadataRepository, Metadata } from "../../../../repository/dist";

@injectable()
export class MetadataController {

    constructor(@inject(TYPES.MetadataRepository) private metadataRepo: MetadataRepository) {
    }

    public getMetadata(domain_id: string): Promise<string | undefined> {
        return new Promise<string | undefined>(async (resolve, reject) => {
            try {
                let met: Metadata | undefined = await this.metadataRepo.getMetadata(domain_id);
                if(met) {
                    return resolve(met.metadata_url)
                }else{
                    return resolve(undefined)
                }
            } catch (err) {
                return reject(err)
            }
        })
    }
}