import type { AWS } from '@serverless/typescript';
import { GatewayResponse } from './gateway-response';

export const resources: AWS['resources'] = {
  Resources: {
    GatewayResponse
  }
};
