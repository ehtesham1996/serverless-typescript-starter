import { BadRequestError } from '../errors';

export function parseBody(json: any, reviver = null): any {
  let body: any = {};
  try {
    if (typeof json === 'object') body = json;
    else body = JSON.parse(json || '{}', reviver);
  } catch (error) {
    console.log('Body Parsing error', error.message);

    if (error instanceof SyntaxError) {
      throw new BadRequestError('Invalid request');
    }
  }
  return body;
}
