import type { APIRoute } from 'astro';
import { buildAiTxt, textFileResponse } from '../lib/llms';

export const GET: APIRoute = async () => textFileResponse(await buildAiTxt());
