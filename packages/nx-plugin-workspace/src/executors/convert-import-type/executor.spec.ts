import { ConvertImportTypeExecutorSchema } from './schema';
import executor from './executor';

const options: ConvertImportTypeExecutorSchema = {};

describe('ConvertImportType Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});