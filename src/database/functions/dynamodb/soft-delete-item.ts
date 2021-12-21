/* eslint-disable import/no-extraneous-dependencies */
import { BadRequestError, DatabaseError } from '@src/core/errors';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { docClient } from './doc-client';

/**
 * @param params DocumentClient DeleteItemInput
 * @description This function does not actually deletes the item. Rather it set's the
 *              'deleted' attribute against that record. So the item might be kept for the
 *              purpose of soft keeping it
 * @returns void
 * @throws BadRequestError If item not found or unable to delete item
 */
export async function softDeleteItem(params: DocumentClient.DeleteItemInput): Promise<void> {
  try {
    const updateParams: DocumentClient.UpdateItemInput = params;
    updateParams.ConditionExpression = `attribute_exists(${Object.keys(params.Key)[0]}) and deleted <> :deleted`;
    updateParams.UpdateExpression = 'set deleted = :deleted';
    updateParams.ExpressionAttributeValues = {
      ':deleted': true
    };
    await docClient().update(params).promise();
  } catch (error) {
    if (error.code === 'ValidationException' || error.code === 'ConditionalCheckFailedException') {
      throw new BadRequestError('Unable to delete non existent item');
    }
    throw new DatabaseError(error);
  }
}
