import { CAC } from 'cac';
import consola from 'consola';
import { selectMultiProjects, selectScope } from '../utils/select-project';
import { availablePackages } from '../utils/packages';
import { ALL_FLAG } from './constants';
import { handler } from './handler';

export default function useCollectPackageDeps(cli: CAC) {
  cli
    .command('collect', 'Collect package deps', {
      allowUnknownOptions: true,
    })
    .alias('c')
    .action(async () => {
      // const scope = await selectScope();
      const projects = await selectMultiProjects(
        [ALL_FLAG],
        'Choose project you want to collect dependencies for'
        // scope
      );

      // single one
      if (projects.length === 1 && !projects.includes(ALL_FLAG)) {
        handler(projects[0]);
        // multi
      } else if (projects.length >= 1 && !projects.includes(ALL_FLAG)) {
        for (const projectItem of projects) {
          handler(projectItem);
        }
        // all
      } else if (projects.includes(ALL_FLAG)) {
        for (const projectItem of availablePackages) {
          handler(projectItem);
        }
      }
    });
}
