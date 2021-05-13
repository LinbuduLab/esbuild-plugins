import { ReactScriptsExecutorSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { from, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import execa from 'execa';

// jest 版本问题
// package.json missing
// nx生成的app和react-scripts要求是不一致的
// 这里要做一次文件检查
// start 和 build会被整合到一起
// 要做的预检查还蛮多的。。。

const reactScriptsStart = (cwd: string) => {
  return execa('react-scripts', ['start'], {
    cwd,
    preferLocal: true,
    stdio: 'inherit',
  });
};

export default function runExecutor(options: any) {
  console.log('Executor ran for ReactScripts', options);
  return eachValueFrom(
    from(reactScriptsStart(options.cwd)).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
