import { DevExecutorSchema } from './schema';
import executor from './executor';

const options: DevExecutorSchema = {};

describe('Dev Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});