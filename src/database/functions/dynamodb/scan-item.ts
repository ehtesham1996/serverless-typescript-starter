/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
import { DatabaseError } from '@src/core/errors';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { docClient } from './doc-client';

export async function scanItem<T>(
  params: DocumentClient.ScanInput,
  limit?: number
): Promise<{ Items: T[]; LastEvaluatedKey: DocumentClient.Key }> {
  try {
    let { ExclusiveStartKey } = params;
    const results: T[] = [];
    do {
      const scanParams = params;
      scanParams.ExclusiveStartKey = ExclusiveStartKey;
      const response = await docClient().scan(scanParams).promise();
      const items: any = response.Items || [];
      results.push(...items);
      ExclusiveStartKey = response.LastEvaluatedKey;
      if (limit && results.length >= limit) {
        break;
      }
    } while (ExclusiveStartKey);
    return {
      Items: results,
      LastEvaluatedKey: ExclusiveStartKey as DocumentClient.Key
    };
  } catch (error: any) {
    throw new DatabaseError(error);
  }
}
