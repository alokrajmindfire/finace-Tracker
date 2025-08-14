import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";

const getOverview  = asyncHandler(async (req:Request& { user?: IUser }, res) =>{
    if (!req.user) {
        throw new ApiError(404, "User does not exist")
    }    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
             [],
        )
    )

})
const getCategoryBreakdown = asyncHandler(async (req:Request& { user?: IUser }, res) =>{
    if (!req.user) {
        throw new ApiError(404, "User does not exist")
    }
  
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
             [],
        )
    )

})
const getMonthlySummary = asyncHandler(async (req:Request& { user?: IUser }, res) =>{
    if (!req.user) {
        throw new ApiError(404, "User does not exist")
    }
  
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
             [],
        )
    )

})

export {
  getOverview,
  getCategoryBreakdown,
  getMonthlySummary,
};