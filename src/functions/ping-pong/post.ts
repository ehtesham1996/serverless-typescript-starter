/* eslint-disable import/no-extraneous-dependencies */
import {
  HttpErrorHandler,
  HttpJsonBodyParserMiddleware,
  ValidateBodyMiddleware
} from '@src/core/middlewares';
import { APIResponse } from '@src/services/response-service/response.service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import middy from 'middy';
import joi from '@hapi/joi';
import 'source-map-support/register';

/**
 * @description A simple handler to get ceritifications from database
 */
const PingPong: APIGatewayProxyHandler = async (event) => {
  const { body } = event;

  return new APIResponse().success('Pong', { hello: 'world', body: body || 'empty' });
};

export const handler = middy(PingPong)
  .use(HttpErrorHandler())
  .use(HttpJsonBodyParserMiddleware())
  .use(ValidateBodyMiddleware(joi.object({}).unknown(true)));
