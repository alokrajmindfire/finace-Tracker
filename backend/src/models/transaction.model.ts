import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITransaction extends Document {
    amount: number;
    type: string;
    categoryId: Types.ObjectId;
    description: string;
    date: Date;
    userId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema({
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    type: {
        type: String,
        required: [true, 'Transaction type is required'],
        enum: ['income', 'expense'],
        lowercase: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Transaction date is required'],
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
{
    timestamps: true,
});



transactionSchema.virtual('formattedAmount').get(function() {
  return this.amount.toFixed(2);
});

export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>("Transaction", transactionSchema);


