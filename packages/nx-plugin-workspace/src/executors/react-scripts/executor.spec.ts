import { ReactScriptsExecutorSchema } from './schema';
import executor from './executor';

const options: ReactScriptsExecutorSchema = {};

describe('ReactScripts Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
