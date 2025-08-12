import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from "../utils/ApiError"
import { IUser, User} from "../models/user.model"
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
            {
                data: categories
            },
        )
    )

})
export {
    categories
}