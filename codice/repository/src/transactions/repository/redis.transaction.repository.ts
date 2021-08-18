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
		this.redis = new Redis();
	}

    public addTransaction(transaction: Transaction): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            try {
                var obj = stringifyNestedFields(transaction)
                var ttl = obj.ttl
                delete obj.ttl
                delete obj._id
                let result1 = await this.redis.hset(transaction._id, obj)
                console.log('redis add result')
                console.log(result1)
                await this.redis.expire(transaction._id, ttl as unknown as number)
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
                var p1 = this.redis.hgetall(transaction_id)
                var p2 = this.redis.ttl(transaction_id)
                var results = await Promise.all([p1, p2])

                var transaction: Transaction = unstringifyNestedFields(results[0])
                var ttl = results[1]
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