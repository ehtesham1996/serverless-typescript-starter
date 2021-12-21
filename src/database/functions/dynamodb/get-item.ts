/* eslint-disable import/no-extraneous-dependencies */
import { BadRequestError, DatabaseError, HttpError } from '@src/core/errors';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { docClient } from './doc-client';

export async function getItem<T>(params: DocumentClient.GetItemInput): Promise<T> {
  try {
    const docClientResponse = await docClient().get(params).promise();
    const item: any = docClientResponse.Item;
    if (!item) throw new BadRequestError('Invalid item specified to be fetched.');
    return item;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new DatabaseError(error);
  }
}
