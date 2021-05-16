// exist fields
// name version main scripts (dev/peer)dependencies
// executors
// generators

// add fields
// license
//  "repository": {
//   "type": "git",
//   "url": "ssh://git@github.com/linbudu599/nx-plugins.git"
// },
// description
// keywords
// author
// contributors
// bugs
// homepage

// nx @nrwl/nx
// esbuild ESBuild
// vite Vite
// snowpack Snowpack(Skypack)
// prisma Prisma
// midway MidwayJS
// serverless Serverless(Ali Cloud & Tencent Cloud)
// umi Umi
// ...
export const createMissingFields = (projectName: string) => {
  const license = 'MIT';
  const [main, integration] = projectName.split('-plugin-');

  const subject =
    main === 'nx' ? '@nrwl/nx' : main === 'esbuild' ? 'ESBuild' : main;

  const description = `${subject} plugin integration with ${integration}.`;

  const keywords = [main, subject, integration, 'plugin', 'monorepo'];

  const repository = {
    type: 'git',
    url: 'git+https://github.com/linbudu599/nx-plugins.git',
  };

  const author =
    'Linbudu <linbudu599@gmail.com> (https://github.com/linbudu599)';

  // const contributors = [author];

  const bugs = {
    url: 'https://github.com/linbudu599/nx-plugins/issues',
  };

  const homepage = `https://github.com/linbudu599/nx-plugins/tree/master/packages/${projectName}#readme`;

  if (projectName === 'nx-plugin-devkit') {
    return {
      license,
      description: 'Nx plugin development utilities collection',
      keywords: ['nx', 'plugin', 'devkit'],
      repository,
      author,
      bugs,
      homepage,
    };
  }

  return {
    license,
    description,
    keywords,
    repository,
    author,
    bugs,
    homepage,
  };
};
