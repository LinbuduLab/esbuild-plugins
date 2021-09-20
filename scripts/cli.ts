import cac from 'cac';
import consola from 'consola';

import useSortConfiguration from './sort-configuration';
import useCollectPackageDeps from './collect-deps';
import useInitPackage from './init-package';
import useCreatePlayground from './create-playground';
import useReleaseProject from './release';

const cli = cac('nx-plugin');

consola.info('Preparing CLI...');

useSortConfiguration(cli);
useCollectPackageDeps(cli);
useInitPackage(cli);
useCreatePlayground(cli);
useReleaseProject(cli);

cli.help();
cli.parse();
