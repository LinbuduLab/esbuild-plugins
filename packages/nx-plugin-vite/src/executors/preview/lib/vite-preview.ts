import type { VitePreviewSchema } from '../schema';
import type { Res } from '../../utils/types';

import { Observable } from 'rxjs';
import execa from 'execa';
import consola from 'consola';
import chalk from 'chalk';

export function startVitePreview(schema: VitePreviewSchema): Observable<Res> {
  const previewCommandArgs = (): string[] => {
    const args = ['preview', schema.root];

    if (schema.port) {
      args.push('--port', `${schema.port}`);
    }

    return args;
  };

  return new Observable((subscriber) => {
    const cmdArgs = previewCommandArgs();

    consola.info(`Executing ${chalk.white(`vite ${cmdArgs.join(' ')}`)}`);

    execa('vite', previewCommandArgs(), {
      stdio: 'inherit',
      preferLocal: true,
    })
      .then(() => {
        subscriber.next({
          success: true,
        });
      })
      .catch((error) => {
        subscriber.error({
          error,
        });
      });
  });
}
