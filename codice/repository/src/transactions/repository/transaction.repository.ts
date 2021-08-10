import { Repository } from "../../repository";
import { TransactionModel } from "../model/transaction.model";

export interface TransactionRepository extends Repository{
    addTransaction(transaction: TransactionModel): Promise<void>;
    approveTransaction(transaction_id: string): Promise<void>;
    refuseTransaction(transaction_id: string): Promise<void>;
    getTransaction(transaction_id: string): Promise<TransactionModel>;
}