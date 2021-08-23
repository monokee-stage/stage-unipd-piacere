import {Request, Response, NextFunction } from "express";
import { CodedError } from "../coded.error";

export const errorHandlerMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    console.log(err.name)
    
    // console.log(err.prototype CodedError)
    if(err instanceof CodedError) {
        let cErr: CodedError = <CodedError>err
        if (cErr.status_code === 500) {
            return res.status(500).json('Internal error')
        }else {
            return res.status(cErr.status_code).json({ error: cErr.message})
        }
    }
    return res.status(500).json('Internal error')
}