import { report } from '@nrwl/workspace/src/command-line/report';
import envinfo from 'envinfo';

export const nxReportHandler = report.handler;

export const envInfo = async (packages: string[] = [], extraOptions = {}) => {
  const envInfos = await envinfo.run(
    {
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Browsers: ['Chrome', 'Firefox', 'Safari'],
      npmPackages: packages,
    },
    { json: false, showNotFound: true, ...extraOptions }
  );

  return envInfos;
};
