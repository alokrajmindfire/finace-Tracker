import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoute from './routes/auth.route'
import categoryRoute from './routes/category.route'
import transactionsRoute from './routes/transaction.route'
import { ApiError } from "./utils/ApiError"
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
app.use("/api/transaction", transactionsRoute)
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});
export { app }