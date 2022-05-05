/* eslint-disable no-param-reassign */
import { UnproccessibleEntity } from '../errors';
import { MiddyHandlerLambda } from '../types/middy-handler.type';
import { parseBody } from '../utils';

const mimePattern = /^application\/(.+\+)?json(;.*)?$/;

const defaults = {
  reviver: undefined
};

export const HttpJsonBodyParserMiddleware: middy.Middleware<any, any> = (opts = {}) => {
  const options = { ...defaults, ...opts };
  const middlewareObject: middy.MiddlewareObject<any, any> = {
    before: async (handler: MiddyHandlerLambda): Promise<any> => {
      const { headers, body } = handler.event;

      const contentTypeHeader = headers?.['Content-Type'] ?? headers?.['content-type'];

      if (mimePattern.test(contentTypeHeader)) {
        try {
          const data = handler.event.isBase64Encoded
            ? Buffer.from(body, 'base64').toString()
            : body;
          handler.event.body = parseBody(data, options.reviver);
        } catch (err) {
          throw new UnproccessibleEntity(
            'Content type defined as JSON but an invalid JSON was provided'
          );
        }
      }
    }
  };
  return middlewareObject;
};
export default HttpJsonBodyParserMiddleware;
