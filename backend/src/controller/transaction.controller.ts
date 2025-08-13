import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from "../utils/ApiError"
import { IUser} from "../models/user.model"
import { ApiResponse } from "../utils/ApiResponse";
import { Request } from "express";
import { Transaction } from "@/models/transaction.model";
import { validateRequiredFields } from "@/utils/validateRequiredFields";


const transactions = asyncHandler(async (req:Request& { user?: IUser }, res) =>{
    if (!req.user) {
        throw new ApiError(404, "User does not exist")
    }
    const userId = req.user._id
    const transactions = await Transaction.find({userId})
    if (!transactions.length) {
        throw new ApiError(404, "No transactions found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
             transactions,
        )
    )

})
const addTransactions = asyncHandler(async (req:Request& { user?: IUser }, res) =>{
    if (!req.user) {
        throw new ApiError(404, "User does not exist")
    }
    const {
        amount,
        type,
        categoryId,
        description,
        date,
        } = req.body
    validateRequiredFields(req.body, ["amount", "type", "categoryId", "description", "date"]);

    const userId = req.user._id
    const transactions = await Transaction.create({amount,type,categoryId,description,date,userId})
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
             transactions,
        )
    )

})

const editTransaction = asyncHandler(async (req: Request & { user?: IUser }, res) => {
  if (!req.user) {
    throw new ApiError(404, "User does not exist");
  }
  const userId = req.user._id;
  const { id } = req.params;
   if (!id) {
    throw new ApiError(404, "Transaction not found");
  }
  const {
      amount,
      type,
      categoryId,
      description,
      date,
  } = req.body
  validateRequiredFields(req.body, ["amount", "type", "categoryId", "description", "date"]);
  const transaction = await Transaction.findOne({ _id: id, userId });
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  Object.assign(transaction, {
      amount,
      type,
      categoryId,
      description,
      date,
      });
  await transaction.save();

  return res.status(200).json(
    new ApiResponse(200, transaction)
  );
});

const deleteTransaction = asyncHandler(async (req: Request & { user?: IUser }, res) => {
  if (!req.user) {
    throw new ApiError(404, "User does not exist");
  }
  const userId = req.user._id;
  const { id } = req.params;

  const transaction = await Transaction.findOne({ _id: id, userId });
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  await transaction.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, { message: "Transaction deleted successfully" })
  );
});

export {
  transactions,
  addTransactions,
  editTransaction,
  deleteTransaction,
};