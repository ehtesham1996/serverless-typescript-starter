import { BadRequestError, DatabaseError } from '@src/core/errors';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { docClient } from './doc-client';

export async function deleteItem(params: DocumentClient.DeleteItemInput): Promise<void> {
  try {
    await docClient().delete(params).promise();
  } catch (error) {
    if (error.code === 'ValidationException') {
      throw new BadRequestError('Unable to delete non existent item');
    }
    throw new DatabaseError(error);
  }
}
