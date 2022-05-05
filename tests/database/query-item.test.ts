import AWS from 'aws-sdk-mock';
import AWSSDK from 'aws-sdk';
import { queryItem } from '@src/database';

describe('database - query item - helper function', () => {
  beforeAll(() => {
    AWS.setSDKInstance(AWSSDK);
  });

  beforeEach(() => {
    AWS.restore();
  });

  it('success - 200', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'query', async (params: any) => {
      // eslint-disable-next-line jest/prefer-strict-equal
      expect(params).toEqual({
        TableName: 'tableName',
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: { ':pk': '123e4567-e89b' }
      });
      return {
        Count: 1,
        Items: [
          {
            pk: '123e4567-e89b',
            title: 'Title'
          }
        ]
      };
    });

    const params = {
      TableName: 'tableName',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': '123e4567-e89b' }
    };

    await expect(queryItem(params)).resolves.toStrictEqual({
      Items: [{ pk: '123e4567-e89b', title: 'Title' }],
      LastEvaluatedKey: undefined
    });
  });

  it('success - 200 - with limit', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'query', async (params: any) => {
      // eslint-disable-next-line jest/prefer-strict-equal
      expect(params).toEqual({
        TableName: 'tableName',
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: { ':pk': '123e4567-e89b' }
      });
      return {
        Count: 2,
        Items: [
          {
            pk: '123e4567-e89b',
            title: 'Title'
          },
          {
            pk: '123e4567-e89b1',
            title: 'Title1'
          }
        ]
      };
    });

    const params = {
      TableName: 'tableName',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': '123e4567-e89b' }
    };

    await expect(queryItem(params, 1)).resolves.toStrictEqual({
      Items: [
        { pk: '123e4567-e89b', title: 'Title' },
        { pk: '123e4567-e89b1', title: 'Title1' }
      ],
      LastEvaluatedKey: undefined
    });
  });

  it('error - 500', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'query', async () => {
      throw new Error('Database Error');
    });

    const params = {
      TableName: 'tableName',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': '123e4567-e89b' }
    };

    await expect(async () => queryItem(params)).rejects.toThrow(
      'Oops! seems like we\'re having difficulties.Please try again later. ERR(DB-02)'
    );
  });
});
