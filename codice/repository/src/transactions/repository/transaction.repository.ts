import { Repository } from "../../repository";
import { Transaction } from "../model/transaction.model";

export interface TransactionRepository extends Repository{
    addTransaction(transaction: Transaction): Promise<void>;
    approveTransaction(transaction_id: string): Promise<void>;
    refuseTransaction(transaction_id: string): Promise<void>;
    getTransaction(transaction_id: string): Promise<Transaction>;
}