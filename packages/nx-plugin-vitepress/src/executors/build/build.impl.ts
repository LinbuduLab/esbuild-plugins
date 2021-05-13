import { ExecutorContext } from '@nrwl/devkit';

import { VitepressBuildSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startVitePressBuild } from './lib/vitepress-build';
import { normalizeSchema } from './lib/normalize-schema';
import { Res } from '../../utils/types';

export default function runExecutor(
  schema: VitepressBuildSchema,
  context: ExecutorContext
) {
  const normalizedSchema = normalizeSchema(schema, context);

  return eachValueFrom<Res>(
    startVitePressBuild(normalizedSchema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
