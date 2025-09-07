// server.ts
import { SanitizedConfig } from 'payload';
import config from './src/payload.config';

export default startPayload(config);

function startPayload(config: Promise<SanitizedConfig>) {
    throw new Error('Function not implemented.');
}
