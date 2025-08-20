import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError"
import { User } from "../models/user.model"
import { ApiResponse } from "../utils/ApiResponse";
import { validateRequiredFields } from "../utils/validateRequiredFields";


const generateAccessTokens = async (userId: number) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User does not exist")
        }
        const accessToken = user.generateAccessToken()

        await user.save({ validateBeforeSave: false })

        return { accessToken }

    } catch (error) {
        console.log("errot", error)
        throw new ApiError(500, "Something went wrong while generating accesstoken")
    }
}

const registerUser = asyncHandler(async (req, res) => {


    const { fullName, email, password } = req.body
    console.log("email: ", { fullName, email, password });
    validateRequiredFields(req.body, ["fullName", "email", "password"]);

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }



    const user = await User.create({
        fullName,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }


    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    // console.log("user", user)
    const { accessToken } = await generateAccessTokens(user._id as number)

    const loggedInUser = await User.findById(user._id).select("-password")

    const options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: boolean | "lax" | "strict" | "none" | undefined;
    } = {
        httpOnly: true, secure: true, sameSite: "none"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken
                },
                "User logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})



export {
    registerUser,
    loginUser,
    logoutUser
}