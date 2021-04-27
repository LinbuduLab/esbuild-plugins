import { FormatExecutorSchema } from './schema';
import executor from './executor';

const options: FormatExecutorSchema = {};

describe('Format Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
