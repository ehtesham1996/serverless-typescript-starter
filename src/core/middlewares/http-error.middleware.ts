/* eslint-disable no-param-reassign */
import middy from 'middy';
import { APIResponse } from '@src/services/response-service/response.service';
import { HttpError } from '@src/core/errors';
import { MiddyHandlerLambda } from '../types/middy-handler.type';

export const HttpErrorHandler: middy.Middleware<any, any> = () => {
  const middlewareObject: middy.MiddlewareObject<any, any> = {
    onError: async (handler: MiddyHandlerLambda): Promise<any> => {
      const { error } = handler;
      console.error('Error Occured =>>', error.message);
      console.error('Stack =>>', error.stack);
      let response = new APIResponse().error();
      if (error instanceof HttpError) {
        response = new APIResponse().error(error.statusCode, error.message);
      }
      handler.response = response;
    }
  };
  return middlewareObject;
};
export default HttpErrorHandler;
