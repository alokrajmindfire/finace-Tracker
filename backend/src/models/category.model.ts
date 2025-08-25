import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const categoriesSchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category: Model<ICategory> = mongoose.model<ICategory>(
  'Category',
  categoriesSchema,
);
