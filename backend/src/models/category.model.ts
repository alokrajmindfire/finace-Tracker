import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    type: string;
    userId: any;
    createdAt?: Date;
    updatedAt?: Date;
}

const categoriesSchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Category type is required'],
    enum: ['income', 'expense'],
    lowercase: true
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



export const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categoriesSchema);


