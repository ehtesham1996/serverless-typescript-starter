import AWS from 'aws-sdk-mock';
import AWSSDK from 'aws-sdk';
import { updateItem, buildUpdateExpression } from '@src/database';

describe('database - update item - helper function', () => {
  beforeAll(() => {
    AWS.setSDKInstance(AWSSDK);
  });

  beforeEach(() => {
    AWS.restore();
  });

  it('success - 200', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'update', async (params: any) => {
      expect(params).toStrictEqual({
        TableName: 'TableName',
        Key: { pk: '12345', sk: 'details' }, UpdateExpression: 'set #status = :status', ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': true }, ReturnValues: 'ALL_NEW'
      });
    });

    const params = {
      TableName: 'TableName',
      Key: { pk: '12345', sk: 'details' }, UpdateExpression: 'set #status = :status', ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': true }, ReturnValues: 'ALL_NEW'
    };

    await updateItem(params);
  });

  it('error - 400', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'update', async () => {
      // eslint-disable-next-line no-throw-literal
      throw { code: 'ConditionalCheckFailedException' };
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1',
        hello: 'world'
      }
    };

    await expect(async () => updateItem(params)).rejects.toThrow('Invalid id specified to be updated ERR(NF-01)');
  });

  it('error - 500', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'update', async () => {
      throw Error('Some error');
    });

    const params = {
      TableName: 'TableName',
      Key: { pk: '12345', sk: 'details' }, UpdateExpression: 'set #status = :status', ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': true }, ReturnValues: 'ALL_NEW'
    };
    await expect(async () => updateItem(params)).rejects.toThrow('Oops! seems like we\'re having difficulties.Please try again later. ERR(DB-02)');
  });


  it('success - build expression', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2020-01-01T00:00:00.000Z');

    expect(buildUpdateExpression({ pk: '123456' }, { hello: 'world', obj2: 'data' })).toStrictEqual(
      {
        Key: { pk: '123456' },
        UpdateExpression: 'set updatedAt = :updatedAt, #hello = :hello, #obj2 = :obj2 ',
        ExpressionAttributeNames: { '#hello': 'hello', '#obj2': 'obj2' },
        ExpressionAttributeValues: {
          ':updatedAt': '2020-01-01T00:00:00.000Z',
          ':pk': '123456',
          ':hello': 'world',
          ':obj2': 'data'
        },
        ConditionExpression: 'pk = :pk'
      }
    );
  });
  it('failure - build expression', async () => {
    expect(() => buildUpdateExpression({ pk: '123456', sk: '123456'}, {})).toThrow('Please specify attributes to be updated ERR(BR-01)');
  });
});