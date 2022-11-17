import path from 'path';
import fs from 'fs-extra';
import { build, BuildOptions } from 'esbuild';
import copy, { Options } from '../../';

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
    absWorkingDir: FixtureDir,
    outfile: esbuildOptions?.outdir ? undefined : out,
    plugins: [copy(pluginOptions)],
    ...(esbuildOptions ?? {}),
  });
};

(async () => {
  fs.rmdirSync(DestDir, { recursive: true });
  fs.ensureDirSync(DestDir);

  await builder(
    '',
    { outdir: DestDir },
    {
      assets: {
        from: `${AssetsDir}/**/*`,
        to: `${DestDir}/assets`,
      },
      resolveFrom: 'out',
      verbose: true,
      dryRun: false,
    }
  );
})();
