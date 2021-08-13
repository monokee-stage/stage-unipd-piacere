import { Transaction } from "../model/transaction.model";
import { TransactionRepository } from "./transaction.repository";

import Redis from 'ioredis';
import { unstringifyNestedFileds } from "../../utils/unstringifyNestedFields";
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
            var obj = stringifyNestedFields(transaction)
            var ttl = obj.ttl
            delete obj.ttl
            delete obj._id
            await this.redis.hset(transaction._id, obj)
            await this.redis.expire(transaction._id, ttl as unknown as number)
            return resolve()
        })
    }
    public approveTransaction(transaction_id: string): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            this.redis.hset(transaction_id, 'status','approved');
            return resolve()
        })
    }
    public refuseTransaction(transaction_id: string): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            this.redis.hset(transaction_id, 'status','denied');
            return resolve()
        })
    }
    // should check that both the promises found a value. If not that means that the transaction expired before at least one of the transactions
    // for security I should check that the transaction obtained was requested from the user that is asking the information now. Or maybe this this check should be done in the route
    public getTransaction(transaction_id: string): Promise<Transaction> {
        return new Promise<Transaction> (async(resolve, reject) => {
            var p1 = this.redis.hgetall(transaction_id)
            var p2 = this.redis.ttl(transaction_id)
            var results = await Promise.all([p1,p2])

            var transaction: Transaction = unstringifyNestedFileds(results[0])
            var ttl = results[1]
            if(ttl !== -2){
                transaction._id = transaction_id
                transaction.ttl = ttl
            }
            return resolve(transaction)
        })
    }
    
}