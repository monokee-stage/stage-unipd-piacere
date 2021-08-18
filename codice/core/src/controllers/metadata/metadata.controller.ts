import { inject, injectable } from "inversify";
import { TYPES, MetadataRepository } from "../../../../repository/dist";

@injectable()
export class MetadataController {

    constructor(@inject(TYPES.MetadataRepository) private metadataRepo: MetadataRepository) {
    }

    public getMetadata(domain_id: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                let met = await this.metadataRepo.getMetadata(domain_id);
                return resolve(met.metadata_url)
            } catch (err) {
                return reject(err)
            }
        })
    }
}