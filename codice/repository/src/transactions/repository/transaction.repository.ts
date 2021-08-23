import { Repository } from "../../repository";
import { Transaction } from "../model/transaction.model";

export interface TransactionRepository extends Repository{
    addTransaction(transaction: Transaction): Promise<void>;
    approveTransaction(transaction_id: string): Promise<boolean>;
    refuseTransaction(transaction_id: string): Promise<boolean>;
    getTransaction(transaction_id: string): Promise<Transaction>;
}