import execa from 'execa';

export default async function dev() {
  await execa('ts-node-dev --respawn src/main.ts', {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
  });
}

(async () => {
  await dev();
})();
