import { NextRequest } from 'next/server';
import * as handler from '../../app/api/report/route';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('report API', () => {
  beforeEach(() => fetchMock.resetMocks());

  it('returns done status', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'done', report: {} }));
    const request = new NextRequest('http://localhost?jobId=xyz');
    const res = await (handler as any).GET(request);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('done');
  });
});
