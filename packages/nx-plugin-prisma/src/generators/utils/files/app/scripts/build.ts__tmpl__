import execa from 'execa';
import { ncp } from 'ncp';
import rimraf from 'rimraf';

export default async function build() {
  rimraf.sync('dist', {});

  await execa('tsc --build tsconfig.app.json', {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
  });

  // FIXME: use cpy instead
  ncp('src/app/prisma', 'dist/app/prisma', (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Prisma Client file copied.');
  });

  ncp('db.sqlite', 'dist/db.sqlite', (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('SQLite file copied.\n');
  });
}

(async () => {
  await build();
})();
