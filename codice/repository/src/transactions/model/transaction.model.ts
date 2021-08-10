export class TransactionModel {
    transaction_id: string
    user_id: string
    requester_id: string
    request_timestamp: string
    status: string
    ttl: number

    constructor(transaction_id?: string, user_id?: string, requester_id?: string,
        request_timestamp?: string, status?: string, ttl?: number){
            this.transaction_id = transaction_id || '';
            this.user_id = user_id || '';
            this.requester_id = requester_id || '';
            this.request_timestamp = request_timestamp || '';
            this.status = status || '';
            this.ttl = ttl || 0;
    }
}