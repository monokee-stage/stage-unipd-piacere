import {Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({error: err})
}