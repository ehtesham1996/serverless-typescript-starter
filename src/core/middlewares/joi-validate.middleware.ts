/* eslint-disable no-param-reassign */
import { ObjectSchema } from 'joi';
import { MiddyHandlerLambda } from '../types/middy-handler.type';
import { validate } from '../utils';

export const ValidateBodyMiddleware: middy.Middleware<ObjectSchema, any> = (schema) => {
  const middlewareObject: middy.MiddlewareObject<any, any> = {
    before: async (handler: MiddyHandlerLambda): Promise<any> => {
      const { body } = handler.event;
      validate(body, schema);
    }
  };
  return middlewareObject;
};
export default ValidateBodyMiddleware;
