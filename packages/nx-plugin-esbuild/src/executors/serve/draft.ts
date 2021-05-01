// import path from 'path';
// import fs from 'fs';
// import { build as esbuild } from 'esbuild';
// import { timer, zip, from } from 'rxjs';
// import { map, tap } from 'rxjs/operators';
// import spawn from 'cross-spawn';
// import { watch } from 'chokidar';
// import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
// import { esbuildDecoratorPlugin } from 'esbuild-plugin-decorator';
// import { esbuildNodeExternalsPlugin } from 'esbuild-plugin-node-externals';
// import { esbuildAliasPathPlugin } from 'esbuild-plugin-alias-path';
// import { eachValueFrom } from 'rxjs-for-await';

// import { ESBuildServeExecutorSchema } from './schema';

// // steps:
// // 1. build
// // 2. start by nodemon or node + chokidar ?
// //
// // options

// export default async function serveExecutor(
//   options: ESBuildServeExecutorSchema,
//   context: ExecutorContext
// ) {
//   const {
//     sourceRoot: projectSourceRoot,
//     root: projectRoot,
//     targets,
//   } = context.workspace.projects[context.projectName];

//   if (!projectSourceRoot) {
//     throw new Error(`${context.projectName} does not have a sourceRoot.`);
//   }

//   if (!projectRoot) {
//     throw new Error(`${context.projectName} does not have a root.`);
//   }

//   const projectTargets = Object.keys(targets);

//   const projectBuildTarget = projectTargets.includes('esbuild')
//     ? 'esbuild'
//     : projectTargets.includes('build')
//     ? 'build'
//     : undefined;

//   if (!projectBuildTarget) {
//     throw new Error('No build target found.');
//   }

//   // 获取到build target配置
//   // TODO:如果没有找到esbuild-build/build配置，则使用默认的一套配置

//   // 还是说应该用workspace中的"options": { "buildTarget": "nest-app:build" }
//   // 官方莫非是waitUntilTarget先构建这玩意...
//   const buildTarget = targets[projectBuildTarget];

//   const buildTargetOptions = buildTarget.options ?? {};

//   const build = async (file: string, outDir: string) => {
//     const result = await esbuild({
//       entryPoints: [file],
//       format: 'cjs',
//       bundle: true,
//       outdir: outDir,
//       platform: 'node',
//       metafile: true,
//       write: false,
//       target: `node${process.version.slice(1)}`,
//       plugins: [esbuildDecoratorPlugin(), esbuildNodeExternalsPlugin()],
//     });

//     // 调用build executor方法还是命令行执行build？

//     const output = result.outputFiles[0];
//     fs.mkdirSync(path.dirname(output.path), { recursive: true });
//     fs.writeFileSync(output.path, output.text, 'utf8');
//     return {
//       get watchFiles() {
//         return new Set(Object.keys(result.metafile?.inputs || {}));
//       },
//       filepath: output.path,
//     };
//   };

//   // eslint-disable-next-line prefer-const
//   let { watchFiles, filepath } = await build(buildTargetOptions.main, 'temp');

//   const startCommand = () => {
//     const cmd = spawn('node', [filepath], {
//       env: {
//         FORCE_COLOR: '1',
//         NPM_CONFIG_COLOR: 'always',
//         ...process.env,
//       },
//       stdio: 'pipe',
//     });
//     cmd.stdout?.pipe(process.stdout);
//     cmd.stderr?.pipe(process.stderr);
//     cmd.stdin?.pipe(process.stdin);
//     return cmd;
//   };

//   let cmd = startCommand();

//   watch(projectSourceRoot, {
//     ignored: '**/{node_modules,dist,temp,.git}/**',
//     ignoreInitial: true,
//     ignorePermissionErrors: true,
//     cwd: process.cwd(),
//   }).on('all', async (event, filepath) => {
//     console.log('event, filepath: ', event, filepath);
//     if (watchFiles.has(filepath)) {
//       cmd.kill();
//       const result = await build(buildTargetOptions.main, 'temp');
//       watchFiles = result.watchFiles;
//       filepath = result.filepath;
//       cmd = startCommand();
//     }
//   });

//   const subAA = from('xxx');
//   const subA = timer(1000, 1000).pipe(map((t) => ({ t })));
//   const subB = timer(1000, 1000).pipe(map((t) => ({ t })));

//   return eachValueFrom(
//     zip(subAA, subA, subB).pipe(
//       tap((e) => {
//         console.log(e);
//       }),

//       map(() => {
//         return {
//           success: false,
//         };
//       })
//     )
//   );
// }
