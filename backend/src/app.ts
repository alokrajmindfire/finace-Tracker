import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoute from './routes/auth.route'
import categoryRoute from './routes/category.route'
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



app.use("/api/", authRoute)
app.use("/api/category", categoryRoute)


export { app }