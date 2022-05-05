import AWS from 'aws-sdk-mock';
import AWSSDK from 'aws-sdk';
import { getItem } from '@src/database';

describe('database - get item - helper function', () => {
  beforeAll(() => {
    AWS.setSDKInstance(AWSSDK);
  });

  beforeEach(() => {
    AWS.restore();
  });

  it('success - 200', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'get', async (params: any) => {
      expect(params).toStrictEqual({ TableName: 'TEST_TABLE', Key: { id: '1234567890-1' } });
      return {
        Item: {
          id: '123456789-0',
          field: 'value1'
        }
      };
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };
    await expect(getItem(params)).resolves.toStrictEqual({ id: '123456789-0', field: 'value1' });
  });

  it('throw error when invalied item specified', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'get', async (params: any) => {
      expect(params).toStrictEqual({ TableName: 'TEST_TABLE', Key: { id: '1234567890-1' } });
      return {};
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };
    await expect(async () => getItem(params)).rejects.toThrow('Invalid item specified to be fetched. ERR(BR-01)');
  });

  it('throw when database is not responding', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'get', async (params: any) => {
      expect(params).toStrictEqual({ TableName: 'TEST_TABLE', Key: { id: '1234567890-1' } });
      throw new Error('some error');
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => getItem(params)).rejects.toThrow('Oops! seems like we\'re having difficulties.Please try again later. ERR(DB-02)');
  });
});