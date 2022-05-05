import AWS from 'aws-sdk-mock';
import AWSSDK from 'aws-sdk';
import { scanItem } from '@src/database';

describe('database - scan item - helper function', () => {
  beforeAll(() => {
    AWS.setSDKInstance(AWSSDK);
  });

  beforeEach(() => {
    AWS.restore();
  });

  it('success - 200', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', async (params: any) => {
      // eslint-disable-next-line jest/prefer-strict-equal
      expect(params).toEqual({ TableName: 'users', FilterExpression: '#user_status = :user_status_val', ExpressionAttributeNames: { '#user_status': 'user_status' }, ExpressionAttributeValues: { ':user_status_val': 'somestatus' } });
      return {
        ConsumedCapacity: {
          CapacityUnits: 0.5,
          TableName: 'Reply'
        },
        Count: 1,
        Items: [{ name: 'JOHN' }],
        ScannedCount: 1
      };

    });

    const params = {
      TableName: 'users',
      FilterExpression: '#user_status = :user_status_val',
      ExpressionAttributeNames: {
        '#user_status': 'user_status'
      },
      ExpressionAttributeValues: { ':user_status_val': 'somestatus' }
    };

    // eslint-disable-next-line jest/prefer-strict-equal
    await expect(scanItem(params)).resolves.toEqual({ Items: [{ name: 'JOHN' }] });
  });

  it('success - 200 - with limit', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', async (params: any) => {
      // eslint-disable-next-line jest/prefer-strict-equal
      expect(params).toEqual({ TableName: 'users', FilterExpression: '#user_status = :user_status_val', ExpressionAttributeNames: { '#user_status': 'user_status' }, ExpressionAttributeValues: { ':user_status_val': 'somestatus' } });
      return {
        ConsumedCapacity: {
          CapacityUnits: 0.5,
          TableName: 'Reply'
        },
        Count: 2,
        Items: [{ name: 'JOHN' }, { name: 'SMITH' }],
        ScannedCount: 2
      };

    });

    const params = {
      TableName: 'users',
      FilterExpression: '#user_status = :user_status_val',
      ExpressionAttributeNames: {
        '#user_status': 'user_status'
      },
      ExpressionAttributeValues: { ':user_status_val': 'somestatus' }
    };

    // eslint-disable-next-line jest/prefer-strict-equal
    await expect(scanItem(params, 1)).resolves.toEqual({ Items: [{ name: 'JOHN' }, { name: 'SMITH' }] });
  });

  it('error - 500', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => {
      throw new Error('Database Error');
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => scanItem(params)).rejects.toThrow('Oops! seems like we\'re having difficulties.Please try again later. ERR(DB-02)');
  });
});

