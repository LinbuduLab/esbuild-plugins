import path from 'path';
import fs from 'fs-extra';
import { build, type BuildOptions } from 'esbuild';
import copy, { type Options } from '../../src/index';

const OutsideFixtureDir = path.resolve(
  __dirname,
  '../outside-working-dir-fixtures'
);
const FixtureDir = path.resolve(__dirname, '../fixtures');
const AssetsDir = path.resolve(FixtureDir, 'assets');

const DestDir = path.resolve(__dirname, './dest');

const builder = async (
  out: string,
  esbuildOptions: BuildOptions = {},
  pluginOptions?: Partial<Options>
): Promise<void> => {
  await build({
    entryPoints: [path.resolve(FixtureDir, 'index.ts')],
    // absWorkingDir: FixtureDir,
    watch: true,
    outfile: esbuildOptions?.outdir ? undefined : out,
    plugins: [copy(pluginOptions)],
    ...(esbuildOptions ?? {}),
  });
};

(async () => {
  fs.rmSync(DestDir, { recursive: true });
  fs.ensureDirSync(DestDir);

  await builder(
    '',
    { outdir: DestDir },
    {
      assets: [
        // assets inside absWorkingDir
        {
          from: `${AssetsDir}/**/*`,
          to: `${DestDir}/assets`,
        },
        // assets outside absWorkingDir
        {
          from: '../../node_modules/chokidar/README.md',
          to: `${DestDir}/ChokidarREADME.md`,
        },
        {
          from: `${OutsideFixtureDir}/**/*`,
          to: `${DestDir}/outside-assets`,
        },
      ],
      resolveFrom: 'out',
      verbose: true,
      dryRun: false,
      watch: true,
    }
  );
})();
