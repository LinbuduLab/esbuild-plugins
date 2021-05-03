import { convertNxExecutor } from '@nrwl/devkit';

import { default as runCommandsExecutor } from './exec.impl';

export default convertNxExecutor(runCommandsExecutor);
