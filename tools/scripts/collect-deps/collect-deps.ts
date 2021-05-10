import { selectMultiProjects, selectScope } from '../utils/select-project';

import { handler } from './handler';
import { availablePackages } from '../utils/packages';

// TODO: support --dry-run flag
// TODO: error handler

const GENERATE_FOR_ALL_PACKAGES = 'all';

export async function main() {
  const scope = await selectScope();
  const projects = await selectMultiProjects(
    [GENERATE_FOR_ALL_PACKAGES],
    'Choose project you want to collect dependencies for',
    scope
  );

  // single one
  if (projects.length === 1 && !projects.includes(GENERATE_FOR_ALL_PACKAGES)) {
    handler(projects[0]);
    // multi
  } else if (
    projects.length >= 1 &&
    !projects.includes(GENERATE_FOR_ALL_PACKAGES)
  ) {
    for (const projectItem of projects) {
      handler(projectItem);
    }
    // all
  } else if (projects.includes(GENERATE_FOR_ALL_PACKAGES)) {
    for (const projectItem of availablePackages) {
      handler(projectItem);
    }
  }
}

main();
