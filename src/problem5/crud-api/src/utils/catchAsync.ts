import { Request, Response, NextFunction } from 'express-serve-static-core';

export interface CustomParamsDictionary {
  [key: string]: any;
}

const catchAsync =
  (
    fn: (
      req: Request<CustomParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>,
      res: Response<any, Record<string, any>>,
      next: NextFunction
    ) => Promise<any> // Accept any return type from the handler
  ) =>
  (
    req: Request<CustomParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export default catchAsync;
