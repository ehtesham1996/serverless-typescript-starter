import AWS from 'aws-sdk-mock';
import AWSSDK from 'aws-sdk';
import { softDeleteItem } from '@src/database';

describe('database - soft delete item - helper function', () => {

  beforeAll(() => {
    AWS.setSDKInstance(AWSSDK);
  });

  beforeEach(() => {
    AWS.restore();
  });

  it('success - 200', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'update', async (params: any) => {
      expect(params).toStrictEqual({
        TableName: 'TEST_TABLE',
        Key: { id: '1234567890-1' },
        ConditionExpression: 'attribute_exists(id) and deleted <> :deleted',
        UpdateExpression: 'set deleted = :deleted',
        ExpressionAttributeValues: { ':deleted': true }
      });
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };
    await softDeleteItem(params);
  });

  it('error - 400 non existent item delete', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'update', async () => {
      // eslint-disable-next-line no-throw-literal
      throw { code: 'ValidationException' };
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => softDeleteItem(params)).rejects.toThrow('Unable to delete non existent item ERR(BR-01)');
  });

  it('error - 500', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'update', async () => {
      throw new Error('Database Error');
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => softDeleteItem(params)).rejects.toThrow('Oops! seems like we\'re having difficulties.Please try again later. ERR(DB-02)');
  });
});