import { Transaction } from "../model/transaction.model";
import { TransactionRepository } from "./transaction.repository";

import Redis from 'ioredis';
import { unstringifyNestedFields } from "../../utils/unstringifyNestedFields";
import { stringifyNestedFields } from "../../utils/stringifyNestedFields";
import { injectable } from "inversify";

@injectable()
export class RedisTransactionRepository implements TransactionRepository {

    private redis: Redis.Redis

	constructor() {
		this.redis = new Redis(undefined, undefined, {maxRetriesPerRequest: 0});
        this.redis.connect(() => {
            console.log('redis connected')
        })
	}

    public addTransaction(transaction: Transaction): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            try {
                let obj: {[key: string]: string} = stringifyNestedFields(transaction)
                const ttl: number = obj.ttl as unknown as number
                delete obj.ttl
                delete obj._id
                const result1: any = await this.redis.hset(transaction._id, obj)
                console.log('redis add result')
                console.log(result1)
                await this.redis.expire(transaction._id, ttl)
                return resolve()
            } catch(err) {
                return reject(err)
            }
        })
    }
    public approveTransaction(transaction_id: string): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            try {
                // forse Redis resetta il ttl
                this.redis.hset(transaction_id, 'status', 'approved');
                return resolve()
            } catch(err) {
                return reject(err)
            }
        })
    }
    public refuseTransaction(transaction_id: string): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            try {
                // forse Redis resetta il ttl
                this.redis.hset(transaction_id, 'status', 'denied');
                return resolve()
            } catch(err) {
                return reject(err)
            }
        })
    }
    // should check that both the promises found a value. If not that means that the transaction expired before at least one of the transactions
    // for security I should check that the transaction obtained was requested from the user that is asking the information now. Or maybe this this check should be done in the route
    public getTransaction(transaction_id: string): Promise<Transaction> {
        return new Promise<Transaction> (async(resolve, reject) => {
            try {
                const p1: Promise<any> = this.redis.hgetall(transaction_id)
                const p2: Promise<number> = this.redis.ttl(transaction_id)
                const results: any[] = await Promise.all([p1, p2])

                const transaction: Transaction = unstringifyNestedFields(results[0])
                const ttl: number = results[1]
                // fix
                if (ttl !== -2) {
                    transaction._id = transaction_id
                    transaction.ttl = ttl
                }
                return resolve(transaction)
            } catch(err) {
                return reject(err)
            }
        })
    }
    
}