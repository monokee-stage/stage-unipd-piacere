import {Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    return res.status(500).json({error: 'Internal error'})
}