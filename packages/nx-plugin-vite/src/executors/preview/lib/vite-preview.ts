import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import execa from 'execa';
import { VitePreviewSchema } from '../schema';
import { Res } from '../../utils/types';

// TODO: 当outDir位于root外部时，不支持预览

export function startVitePreview(schema: VitePreviewSchema): Observable<Res> {
  const previewCommandArgs = (): string[] => {
    const args = ['preview', schema.root];

    if (schema.port) {
      args.push('--port', `${schema.port}`);
    }

    return args;
  };

  return new Observable((subscriber) => {
    execa('vite', previewCommandArgs(), {
      stdio: 'inherit',
      preferLocal: true,
    })
      .then(() => {
        subscriber.next({
          success: true,
        });
      })
      .catch(() => {
        subscriber.next({
          success: false,
        });
      });
  });
}
