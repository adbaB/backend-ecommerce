import axios from 'axios';

describe('POST /api/categories', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api/categories`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});
