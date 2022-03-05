import { convertNxExecutor } from '@nrwl/devkit';

import runCommandsExecutor from './exec.impl';

export default convertNxExecutor(runCommandsExecutor);
