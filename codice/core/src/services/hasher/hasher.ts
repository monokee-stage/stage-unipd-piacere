import {Service} from '../service'
import * as crypto from 'crypto';
import { injectable } from 'inversify';
// import {Hash} from 'crypto';

// there is a problem: the hash object can't be reused after digest has been called. Maybe it's better to use static methods and no attribute. Or maybe not because algoirthm may remain an attribute.
@injectable()
export class Hasher implements Service {
    private hash!: crypto.Hash
    private algorithm: string

    constructor(algorithm?: string) {
        this.algorithm = algorithm || process.env.HASHING_ALGORITHM || 'sha256'
    }

    // returns the hashed string encoded in base64
    public hashText(text: string): string {
        this.hash = crypto.createHash(this.algorithm)
        this.hash.update(text)
        return this.hash.digest().toString('base64')
    }
}