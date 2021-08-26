import {Request, Response, NextFunction } from "express";
import { CodedError } from "../coded.error";

export const errorHandlerMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    console.log(err.stack)
    
    if(err instanceof CodedError) {
        let cErr: CodedError = <CodedError>err
        if (cErr.status_code === 500) {
            return res.status(500).json(
                {
                    type: 'Internal error',
                    error: err.stack
                })
        }else {
            return res.status(cErr.status_code).json({ error: cErr.message})
        }
    }
    return res.status(500).json({
        type: 'Internal coded error',
        error: err.stack}
        )
}