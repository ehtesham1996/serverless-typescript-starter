import { ObjectSchema } from 'joi';
import { BadRequestError } from '../errors';

/**
 * @description Generic Joi Validation
 * @param payload | Joi Schema
 */
export const validate = (payload: any, schema: ObjectSchema<any>): void => {
  try {
    const result = schema.validate(payload || {});
    if (result.error) {
      throw new Error(result.error.details[0].message);
    }
  } catch (error) {
    throw new BadRequestError((error as Error).message);
  }
};

export default validate;
