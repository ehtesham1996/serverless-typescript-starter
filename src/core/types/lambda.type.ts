import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  APIGatewayProxyResult,
  Handler
} from 'aws-lambda';

export type APIGatewayAuthenticatedEvent = APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>
export type APIGatewayAuthenticatedHandler = Handler<APIGatewayAuthenticatedEvent, APIGatewayProxyResult>;
