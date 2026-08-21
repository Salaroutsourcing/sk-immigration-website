import type { APIRoute } from 'astro';
import { buildLlmsIndex, textFileResponse } from '../lib/llms';

export const GET: APIRoute = async () => textFileResponse(await buildLlmsIndex());
