import { TransactionModel } from "../..";
import { TransactionRepository } from "./transaction.repository";

import Redis from 'ioredis';

export class RedisTransactionRepository implements TransactionRepository {

    private redis: Redis.Redis

	constructor() {
		this.redis = new Redis();
	}

    public addTransaction(transaction: TransactionModel): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public approveTransaction(transaction_id: string): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            this.redis.hset(transaction_id, 'status','approved');
        })
    }
    public refuseTransaction(transaction_id: string): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            this.redis.hset(transaction_id, 'status','denyied');
        })
    }
    public getTransaction(transaction_id: string): Promise<TransactionModel> {
        return new Promise<TransactionModel> (async(resolve, reject) => {
            var data = new TransactionModel();

            var promise1 = this.redis.hgetall(transaction_id).then(result => {
                console.log(result);
                data.transaction_id = result.transaction_id;
                data.user_id = result.user_id;
                data.requester_id = result.requester_id;
                data.request_timestamp = result.request_timestamp;
                data.status = result.status;
            });

            var promise2 = this.redis.ttl(transaction_id).then(result => {
                data.ttl = result;
            })

            Promise.all([promise1, promise2]).then(() => {
                return resolve(data);
            })
        })
    }
    
}