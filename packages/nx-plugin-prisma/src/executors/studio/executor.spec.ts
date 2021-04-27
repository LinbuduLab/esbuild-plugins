import { StudioExecutorSchema } from './schema';
import executor from './executor';

const options: StudioExecutorSchema = {};

describe('Studio Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
