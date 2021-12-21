/* eslint-disable import/no-extraneous-dependencies */
import { DatabaseError } from '@src/core/errors';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { docClient } from './doc-client';

export async function putItem(params: DocumentClient.PutItemInput): Promise<void> {
  try {
    await docClient().put(params).promise();
  } catch (error) {
    throw new DatabaseError(error);
  }
}
