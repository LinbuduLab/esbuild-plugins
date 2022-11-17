import cac from 'cac';
import consola from 'consola';

import useReleaseProject from './release';

const cli = cac('nx-plugin');

consola.info('Preparing CLI...');

useReleaseProject(cli);

cli.help();
cli.parse();
