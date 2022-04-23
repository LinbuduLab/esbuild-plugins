import { reportHandler } from 'nx/src/command-line/report';
import envinfo, { Options } from 'envinfo';
import execa, { Options as ExecaOptions } from 'execa';

export const nxReportHandler: () => void = reportHandler;

/**
 * Report system environment informations
 * @param packages
 * @param extraOptions
 * @returns
 */
export const envInfo = async (
  packages: string[] = [],
  extraOptions: Options = {}
): Promise<string> => {
  const envInfos = await envinfo.run(
    {
      System: ['OS', 'CPU', 'Shell'],
      Binaries: ['Node', 'Yarn', 'npm', 'pnpm'],
      Browsers: ['Chrome', 'Firefox', 'Safari'],
      npmPackages: packages,
    },
    { json: false, showNotFound: true, ...extraOptions }
  );

  return envInfos;
};

export const envInfoCLI = async (
  packages: string[] = [],
  execaOptions: ExecaOptions = {}
) => {
  await execa(
    `npx envinfo --system --browsers  --binaries --npmPackages=${packages.join(
      ','
    )} --console`,
    {
      stdio: 'inherit',
      shell: true,
      ...execaOptions,
    }
  );
};
