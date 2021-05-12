import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackServeSchema } from './schema';
import { from } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';
import { map, tap } from 'rxjs/operators';
import {
  createConfiguration,
  loadConfiguration,
  startServer,
  build,
} from 'snowpack';

export default function runExecutor(
  options: SnowpackServeSchema,
  context: ExecutorContext
) {
  // const config =  loadConfiguration(
  //   {
  //     root: options.cwd,
  //     workspaceRoot: options.cwd,
  //     mode: 'development',
  //     devOptions: {
  //       port: 6666,
  //     },
  //   },
  //   options.configPath
  // );

  const config = createConfiguration({
    root: options.cwd,
    workspaceRoot: options.workspace,
    mount: {
      public: { url: options.mountRoot, static: true },
      src: { url: `${options.mountRoot}/dist` },
    },
    mode: 'production',
    devOptions: {
      port: 6666,
    },
    buildOptions: {
      watch: false,
      out: options.outputPath,
    },
  });

  return build({
    config,
  }).then((x) => {
    return {
      success: true,
    };
  });

  // return eachValueFrom(
  //   from(
  //     startServer({
  //       config,
  //     })
  //   ).pipe(
  //     tap((x) => {
  //       console.log(x);
  //     }),
  //     map(() => {
  //       return {
  //         success: true,
  //       };
  //     })
  //   )
  // );
}
