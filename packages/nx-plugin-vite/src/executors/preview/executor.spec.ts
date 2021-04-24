import { PreviewExecutorSchema } from './schema';
import executor from './executor';

const options: PreviewExecutorSchema = {};

describe('Preview Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
