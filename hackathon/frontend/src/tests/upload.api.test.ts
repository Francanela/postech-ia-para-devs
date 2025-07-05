import { NextRequest } from 'next/server';
import * as handler from '../../app/api/upload/route';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('upload API', () => {
  beforeEach(() => fetchMock.resetMocks());

  it('returns 200 with jobId', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ jobId: 'abc', status: 'processing' }));
    // NextRequest needs a URL, but body irrelevant for test
    const request = new NextRequest('http://localhost', { method: 'POST' });
    const res = await (handler as any).POST(request);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.jobId).toBe('abc');
  });
});
