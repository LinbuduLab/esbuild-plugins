import execa from 'execa';
import { from, Observable } from 'rxjs';
import path from 'path';
import Parcel, { createWorkerFarm } from '@parcel/core';
import { NodeFS, MemoryFS } from '@parcel/fs';

export const startProgrammaticServe = (entry: string, root: string) => {
  let workerFarm = createWorkerFarm();
  let inputFS = new NodeFS();
  let outputFS = new MemoryFS(workerFarm);

  inputFS.cwd = () => root;

  let bundler = new Parcel({
    entries: [entry],
    enentryRoot: root,
    inputFS: inputFS,
    outputFS: outputFS,
    // 'D:/schematics/apps/node-app/parcel/.parcelrc'
    workerFarm,
    cacheDir: 'D:/schematics/apps/node-app/parcel/.parcel-cache',
    config: {
      filePath: 'D:/schematics/apps/node-app/parcel/.parcelrc',
    },
    // rootDir: 'D:/schematics/apps/node-app/parcel',
    // projectRoot: 'D:/schematics/apps/node-app/parcel',
    // lockFile: 'D:/schematics/apps/node-app/parcel/yarn.lock',
    defaultConfig: require.resolve('@parcel/config-default'),
    defaultTargetOptions: {
      engines: {
        browsers: ['last 1 Chrome version'],
        node: '10',
      },
    },
    serve: true,
    mode: 'development',
    shouldPatchConsole: true,
  });

  return from(bundler.run());
};
