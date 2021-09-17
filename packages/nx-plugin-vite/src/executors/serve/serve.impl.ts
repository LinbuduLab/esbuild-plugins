import { ViteServeSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';

import { startViteServer } from './lib/vite-serve';

export default function runExecutor(schema: ViteServeSchema) {
  return eachValueFrom(startViteServer(schema).pipe(map((res) => res)));
}
