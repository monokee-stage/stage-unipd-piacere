import { Transaction } from "../model/transaction.model";
import { TransactionRepository } from "./transaction.repository";

import Redis from 'ioredis';
import { unstringifyNestedFields } from "../../utils/unstringifyNestedFields";
import { stringifyNestedFields } from "../../utils/stringifyNestedFields";
import { injectable } from "inversify";

@injectable()
export class RedisTransactionRepository implements TransactionRepository {

    private redis: Redis.Redis

    constructor(options?: Object) {
        const opts: any = options || JSON.parse(process.env.REDIS_OPTIONS || '{}') || undefined
        this.redis = new Redis(opts);
        this.redis.connect(() => {
            console.log(`redis connected on host: ${opts.host}`)
        })
    }

    public addTransaction(transaction: Transaction): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                let obj: { [key: string]: string } = stringifyNestedFields(transaction)
                const ttl: number = obj.ttl as unknown as number
                delete obj.ttl
                delete obj._id
                const result1: any = await this.redis.hset(transaction._id, obj)
                await this.redis.expire(transaction._id, ttl)
                return resolve()
            } catch (err) {
                return reject(err)
            }
        })
    }
    public approveTransaction(transaction_id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const trans = await this.redis.hgetall(transaction_id)
                if (Object.keys(trans).length > 0) {
                    await this.redis.hset(transaction_id, 'status', 'approved');
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            } catch (err) {
                return reject(err)
            }
        })
    }
    public refuseTransaction(transaction_id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const trans = await this.redis.hgetall(transaction_id)
                if (Object.keys(trans).length > 0) {
                    await this.redis.hset(transaction_id, 'status', 'refused');
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            } catch (err) {
                return reject(err)
            }
        })
    }
    public getTransaction(transaction_id: string): Promise<Transaction | undefined> {
        return new Promise<Transaction | undefined>(async (resolve, reject) => {
            try {
                const p1: Promise<any> = this.redis.hgetall(transaction_id)
                const p2: Promise<number> = this.redis.ttl(transaction_id)
                const results: any[] = await Promise.all([p1, p2])

                const transaction: Transaction = unstringifyNestedFields(results[0])
                const ttl: number = results[1]

                if (ttl === -2 || Object.keys(transaction).length === 0) {
                    return resolve(undefined)
                } else {
                    transaction._id = transaction_id
                    transaction.ttl = ttl
                }
                return resolve(transaction)
            } catch (err) {
                return reject(err)
            }
        })
    }

}