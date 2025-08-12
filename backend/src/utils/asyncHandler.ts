import { Request, Response, NextFunction } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (fn: AsyncFn) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (err: any) {
            res.status(err.statusCode || err.status || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    };

export { asyncHandler };
