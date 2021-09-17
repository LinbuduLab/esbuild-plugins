import cac from 'cac';
import consola from 'consola';

import useSortConfiguration from './sort-configuration';
import useCollectPackageDeps from './collect-deps';
import useInitPackage from './init-package';
import useCreatePlayground from './create-playground';

const cli = cac('nx-plugin');

consola.info('Preparing CLI...');

useSortConfiguration(cli);
useCollectPackageDeps(cli);
useInitPackage(cli);
useCreatePlayground(cli);

cli.help();
cli.parse();
