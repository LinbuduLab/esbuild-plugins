import { report } from '@nrwl/workspace/src/command-line/report';
import envinfo from 'envinfo';

export const nxReportHandler: () => void = report.handler;

/**
 * Report system environment informations
 * @param packages
 * @param extraOptions
 * @returns
 */
export const envInfo = async (
  packages: string[] = [],
  extraOptions = {}
): Promise<string> => {
  const envInfos = await envinfo.run(
    {
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm', 'pnpm'],
      Browsers: ['Chrome', 'Firefox', 'Safari'],
      npmPackages: packages,
    },
    { json: false, showNotFound: true, ...extraOptions }
  );

  return envInfos;
};
