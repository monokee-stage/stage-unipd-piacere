import * as crypto from 'crypto';
import { injectable } from 'inversify';

@injectable()
export class RandomCodeGenerator {
    public getCode(): string {
        return crypto.randomUUID();
    }
}