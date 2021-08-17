import * as crypto from 'crypto';
import { injectable } from 'inversify';

@injectable()
export class UUIDGenerator {
    public getUUID(): string {
        try {
            return crypto.randomUUID();
        } catch(err) {
            throw err
        }
    }
}