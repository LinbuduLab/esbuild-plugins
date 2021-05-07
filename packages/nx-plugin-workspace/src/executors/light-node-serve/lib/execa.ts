import execa from 'execa';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

// ts-node-dev [node-dev|ts-node flags] [ts-node-dev flags] [node cli flags] [--] [script] [script arguments]
// tsnd
export const startExeca = (tsConfig: string, main: string) => {
  return from(
    execa(
      'ts-node-dev',
      [
        // node-dev
        '--respawn',
        // ts-node
        '--pretty',
        // '--transpile-only',
        '--compiler typescript',
        '--prefer-ts-exts',
        '--log-error',
        // TODO: 测试
        // TODO: 如何确保安装？
        '--project',
        tsConfig,
        '-r tsconfig-paths/register',
        '--',
        main,
      ],
      {
        stdio: 'inherit',
        preferLocal: true,
      }
    )
  );
};
