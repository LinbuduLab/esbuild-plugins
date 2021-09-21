import { TscExecutorSchema } from './schema';
import executor from './executor';

const options: TscExecutorSchema = {};

describe('Tsc Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});