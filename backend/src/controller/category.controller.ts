import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from "../utils/ApiError"
import { IUser} from "../models/user.model"
import { ApiResponse } from "../utils/ApiResponse";
import { Request } from "express";
import { Category } from "@/models/category.model";


const categories = asyncHandler(async (req:Request& { user?: IUser }, res) =>{
    const user = req.user

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   
    console.log("user",user)

    const categories = await Category.find({userId:user._id})
    if (!categories) {
        throw new ApiError(404, "No Categories found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
             categories,
        )
    )

})

const addCategories = asyncHandler(async (req:Request& { user?: IUser }, res) =>{
    const user = req.user
    const {name,type} = req.body
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    if (
        [name,type].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const category = await Category.create({
        name,
        type, 
        userId:user._id,
    })    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            category,
            "Category created successfully"
        )
    )

})
export {
    categories,  
    addCategories
}