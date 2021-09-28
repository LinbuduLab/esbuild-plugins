import type { VitePreviewSchema } from './schema';

import { map } from 'rxjs/operators';

import { eachValueFrom } from 'rxjs-for-await';
import { startVitePreview } from './lib/vite-preview';

// Vite doesnot export preview handler
export default function runExecutor(schema: VitePreviewSchema) {
  return eachValueFrom(startVitePreview(schema).pipe(map((res) => res)));
}
