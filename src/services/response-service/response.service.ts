import { APIGatewayProxyResult } from 'aws-lambda';
import { CustomResponse } from './types/custom-response.type';

export class APIResponse implements APIGatewayProxyResult {
  statusCode: number;

  headers?: { [header: string]: string | number | boolean };

  multiValueHeaders?: { [header: string]: (string | number | boolean)[] };

  body: string;

  isBase64Encoded?: boolean;

  private apiResponse: CustomResponse;

  success(message = 'OK', data?: any): APIGatewayProxyResult {
    this.setHeaders();
    this.statusCode = 200;
    this.apiResponse = {
      success: true,
      error: false,
      message,
      data
    };
    return this.build;
  }

  error(statusCode = 500, message = 'Internal server error occurred'): APIGatewayProxyResult {
    this.setHeaders();
    this.statusCode = statusCode;
    this.apiResponse = {
      error: true,
      success: false,
      message
    };

    return this.build;
  }

  unAuthorized(message = 'Internal server error occurred'): APIGatewayProxyResult {
    this.setHeaders();
    this.statusCode = 401;
    this.apiResponse = {
      error: true,
      success: false,
      message
    };

    return this.build;
  }

  setHeaders(headers: { [header: string]: string | number | boolean } = {}): APIResponse {
    this.headers = headers;
    this.headers['Access-Control-Allow-Origin'] = '*';
    this.headers['Access-Control-Allow-Credentials'] = true;
    this.headers['Access-Control-Allow-Headers'] = '*';
    return this;
  }

  setStatusCode(statusCode: number): APIResponse {
    this.statusCode = statusCode;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  setBody(body: object): APIResponse {
    this.apiResponse.data = JSON.stringify(body);
    return this;
  }

  private get build(): APIGatewayProxyResult {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(this.apiResponse),
      headers: this.headers,
      multiValueHeaders: this.multiValueHeaders,
      isBase64Encoded: this.isBase64Encoded
    };
  }
}
