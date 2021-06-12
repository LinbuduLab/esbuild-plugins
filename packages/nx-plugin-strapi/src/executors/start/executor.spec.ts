import { StartExecutorSchema } from './schema';
import executor from './executor';

const options: StartExecutorSchema = {};

describe('Start Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});