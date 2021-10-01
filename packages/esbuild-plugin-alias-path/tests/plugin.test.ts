import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import { build } from 'esbuild';
import { esbuildPluginAliasPath } from '../src/lib/esbuild-plugin-alias-path';
import { Options } from '../src/lib/normalize-options';

let originOutputFile: string;
let originOutput: string;

const builder = async (out: string, pluginOptions?: Options): Promise<void> => {
  await build({
    entryPoints: [path.resolve(__dirname, './fixtures/input.ts')],
    absWorkingDir: path.resolve(__dirname, './fixtures'),
    outfile: out,
    bundle: true,
    plugins: [pluginOptions && esbuildPluginAliasPath(pluginOptions)].filter(
      Boolean
    ),
  });
};

beforeEach(async () => {
  originOutputFile = tmp.fileSync().name;

  await builder(originOutputFile);

  originOutput = fs.readFileSync(originOutputFile, 'utf-8');
});

describe('esbuildPluginAliasPath', () => {
  it('should skip when specified', async () => {
    const buildFile = tmp.fileSync();

    await builder(buildFile.name, { skip: true });

    expect(fs.readFileSync(buildFile.name, 'utf-8')).toStrictEqual(
      originOutput
    );
  });

  it.only('should apply path alias transform', async () => {
    const buildFile = tmp.fileSync();

    await builder(buildFile.name, {
      tsconfigPath: path.resolve(__dirname, './fixtures/tsconfig.json'),
    });

    console.log(fs.readFileSync(buildFile.name, 'utf-8'));

    // expect(fs.readFileSync(buildFile.name, 'utf-8')).toStrictEqual(
    //   originOutput
    // );
  });
});
