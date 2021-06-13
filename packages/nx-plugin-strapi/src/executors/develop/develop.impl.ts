import { DevelopExecutorSchema } from './schema';
import { of, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import execa from 'execa';

export default function runExecutor(options: DevelopExecutorSchema) {
  return eachValueFrom(
    from(
      execa('strapi', ['develop'], {
        stdio: 'inherit',
        cwd: options.cwd,
        preferLocal: true,
      })
    ).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
