import cac from 'cac';
import consola from 'consola';

import useSortConfiguration from './sort-configuration';
import useCollectPackageDeps from './collect-deps';
import useInitPackage from './init-package';
import useCreatePlayground from './create-playground';
import useReleaseProject from './release';
import useSyncWorkspacePackageVersion from './sync-package-version';

const cli = cac('nx-plugin');

consola.info('Preparing CLI...');

useSortConfiguration(cli);
useCollectPackageDeps(cli);
useInitPackage(cli);
useCreatePlayground(cli);
useReleaseProject(cli);
useSyncWorkspacePackageVersion(cli);

cli.help();
cli.parse();
