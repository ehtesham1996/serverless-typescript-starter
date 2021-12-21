import AWS from 'aws-sdk-mock';
import AWSSDK from 'aws-sdk';
import { putItem } from '@src/database';

describe('database - put item - helper function', () => {
  beforeAll(() => {
    AWS.setSDKInstance(AWSSDK);
  });

  beforeEach(() => {
    AWS.restore();
  });

  it('success - 200', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', async (params: any) => {
      expect(params).toStrictEqual({ TableName: 'TEST_TABLE', Item: { id: '1234567890-1', hello: 'world' } });
    });

    const params = {
      TableName: 'TEST_TABLE',
      Item: {
        id: '1234567890-1',
        hello: 'world'
      }
    };
    await putItem(params);
  });

  it('error - 500', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', async () => {
      throw Error('Some error');
    });

    const params = {
      TableName: 'TEST_TABLE',
      Item: {
        id: '1234567890-1',
        hello: 'world'
      }
    };

    await expect(async () => putItem(params)).rejects.toThrow('Oops! seems like we\'re having difficulties.Please try again later. ERR(DB-02)');
  });
});