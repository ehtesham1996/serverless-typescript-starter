import type { AWS } from '@serverless/typescript';

export const functions: AWS['functions'] = {
  'ping-pong': {
    handler: 'src/functions/ping-pong/post.handler',
    events: [
      {
        http: {
          method: 'POST',
          path: '/ping',
          cors: true
        }
      },
      {
        http: {
          method: 'GET',
          path: '/ping',
          cors: true
        }
      }
    ]
  }
};
