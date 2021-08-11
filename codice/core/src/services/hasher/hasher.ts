import {Service} from '../service'
import * as crypto from 'crypto';
import { injectable } from 'inversify';
// import {Hash} from 'crypto';

@injectable()
export class Hasher implements Service {
    private hash: crypto.Hash

    constructor(algorithm?: string) {
        this.hash = crypto.createHash(algorithm || process.env.HASHING_ALGORITHM || 'sha256')
    }

    // returns the hashed string encoded in base64
    public hashText(text: string): string {
        this.hash.update(text)
        return this.hash.digest().toString('base64')
    }
}