import * as crypto from 'crypto';
import { injectable } from 'inversify';

@injectable()
export class RandomCodeGenerator {
    public getCode(): string {
        try {
            return crypto.randomUUID();
        } catch(err) {
            throw err
        }
    }
}