import {Service} from '../service'
import * as crypto from 'crypto';
import { injectable } from 'inversify';

// it's unnecessary to have a hash attribute since the crypto.Hash object has to be recreated at each hashText(...)
@injectable()
export class Hasher implements Service {
    private algorithm: string

    constructor(algorithm?: string) {
        try {
            this.algorithm = algorithm || process.env.HASHING_ALGORITHM || 'sha256'
        } catch (err) {
            throw err
        }
    }

    // returns the hashed string encoded in base64
    public hashText(text: string): string {
        try {
            const hash: crypto.Hash = crypto.createHash(this.algorithm)
            hash.update(text)
            return hash.digest().toString('base64')
        } catch(err) {
            throw err
        }
    }
}