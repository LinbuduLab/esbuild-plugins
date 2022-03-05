import { CAC } from 'cac';
import { selectMultiProjects } from '../utils/select-project';
import { allPackages, availablePackages } from '../utils/packages';
import { ALL_FLAG } from './constants';
import { handler } from './handler';

export default function useCollectPackageDeps(cli: CAC) {
  cli
    .command('collect [project]', 'Collect package deps', {
      allowUnknownOptions: true,
    })
    .alias('c')
    .action(async (project?: string) => {
      if (project && allPackages.includes(project)) {
        handler(project);
        return;
      }

      const projects = await selectMultiProjects(
        [ALL_FLAG],
        'Choose project you want to collect dependencies for'
      );

      if (projects.includes(ALL_FLAG)) {
        for (const projectItem of availablePackages) {
          handler(projectItem);
        }
        return;
      }

      for (const projectItem of projects) {
        handler(projectItem);
      }
    });
}
