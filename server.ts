// server.ts
import { startPayload } from '@payloadcms/next';
import config from './src/payload.config';

export default startPayload(config);