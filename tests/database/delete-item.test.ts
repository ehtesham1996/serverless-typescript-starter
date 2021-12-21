import AWS from 'aws-sdk-mock';
import AWSSDK from 'aws-sdk';
import { deleteItem } from '@src/database';

describe('database - delete item - helper function', () => {
  beforeAll(() => {
    AWS.setSDKInstance(AWSSDK);
  });

  beforeEach(() => {
    AWS.restore();
  });

  it('success - 200', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'delete', async (params: any) => {
      expect(params).toStrictEqual({ TableName: 'TEST_TABLE', Key: { id: '1234567890-1' } });
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };
    await deleteItem(params);
  });

  it('error - 400', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'delete', async () => {
      // eslint-disable-next-line no-throw-literal
      throw { code: 'ValidationException' };
    });
    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => deleteItem(params)).rejects.toThrow(
      'Unable to delete non existent item ERR(BR-01)'
    );
  });

  it('error - 500', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'delete', async () => {
      throw new Error('Database Error');
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => deleteItem(params)).rejects.toThrow(
      'Oops! seems like we\'re having difficulties.Please try again later. ERR(DB-02)'
    );
  });
});
