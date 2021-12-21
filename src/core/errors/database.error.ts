/* eslint-disable max-classes-per-file */

import { HttpError } from './http.error';

/**
 * @description database error description class.This defines
 *              the database error with message DB-01 code
 */
export class DatabaseConnectionError extends HttpError {
  constructor() {
    super(
      "Oops! seems like we're having difficulties.Please try again later. ERR(DB-01)",
      500
    );
  }
}

export class DatabaseError extends HttpError {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_msg) {
    super(
      "Oops! seems like we're having difficulties.Please try again later. ERR(DB-02)",
      500
    );
  }
}
