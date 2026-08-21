import type { APIRoute } from 'astro';
import { buildLlmsFull, textFileResponse } from '../lib/llms';

export const GET: APIRoute = async () => textFileResponse(await buildLlmsFull());
