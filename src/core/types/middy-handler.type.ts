import { APIGatewayProxyEvent } from 'aws-lambda';
import { APIGatewayAuthenticatedEvent } from './lambda.type';

export type MiddyHandlerLambda = middy.HandlerLambda<APIGatewayAuthenticatedEvent | APIGatewayProxyEvent, any>
