import { Transaction } from '../models/transaction.model';
import { Types } from 'mongoose';

export class TransactionRepository {
  async findAllByUser(userId: Types.ObjectId) {
    return Transaction.find({ userId }).populate({
      path: 'categoryId',
      select: 'name',
    });
  }

  async findOneById(id: string, userId: Types.ObjectId) {
    return Transaction.findOne({ _id: id, userId });
  }

  async create(data: any) {
    return Transaction.create(data);
  }

  async update(id: string, updates: any) {
    const transaction = await Transaction.findById(id);
    if (!transaction) return null;
    Object.assign(transaction, updates);
    return transaction.save();
  }

  async delete(id: string, userId: Types.ObjectId) {
    return Transaction.findOneAndDelete({ _id: id, userId });
  }

  async aggregate(pipeline: any[]) {
    return Transaction.aggregate(pipeline);
  }
}
