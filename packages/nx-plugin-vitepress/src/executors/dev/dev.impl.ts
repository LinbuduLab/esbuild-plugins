import { ExecutorContext } from '@nrwl/devkit';

import { VitepressDevSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startVitePressDev } from './lib/vitepress-dev';
import { normalizeSchema } from './lib/normalize-schema';
import { Res } from '../../utils/types';

export default function runExecutor(
  schema: VitepressDevSchema,
  context: ExecutorContext
) {
  const normalizedSchema = normalizeSchema(schema, context);

  return eachValueFrom(
    startVitePressDev(normalizedSchema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
