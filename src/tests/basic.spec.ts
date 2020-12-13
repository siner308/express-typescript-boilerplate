import initDB from '../config/database';

/**
 * If you need a database, use this code
 */

describe('Basic Test', () => {
  beforeAll(async () => {
    console.log('db started');
    await initDB();
    console.log('db finished');
  });
  it('sum', async () => {
    console.log('test started');
    const sum: number = 1 + 3;
    expect(sum).toBe(4);
    console.log('test finished');
  });
});
