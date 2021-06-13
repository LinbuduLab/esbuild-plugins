// import path from 'path';
// import cluster from 'cluster';
// import fs from 'fs-extra';
// import chokidar from 'chokidar';
// import execa from 'execa';

// import { logger } from 'strapi-utils';
// import loadConfiguration from 'strapi/lib/core/app-configuration';
// // import strapi from 'strapi/lib/index.js';

// const strapi = require('strapi/lib/index.js');

// export async function develop(cwd: string) {
//   const dir = cwd;
//   const config = loadConfiguration(dir);

//   const build = false;
//   const watchAdmin = true;
//   const browser = 'chrome';
//   const polling = true;

//   const adminWatchIgnoreFiles = config.get('server.admin.watchIgnoreFiles', []);

//   try {
//     if (cluster.isMaster) {
//       if (watchAdmin) {
//         try {
//           execa(
//             'npm',
//             ['run', '-s', 'strapi', 'watch-admin', '--', '--browser', browser],
//             {
//               stdio: 'inherit',
//             }
//           );
//         } catch (err) {
//           process.exit(1);
//         }
//       }

//       cluster.on('message', (worker, message) => {
//         switch (message) {
//           case 'reload':
//             logger.info('The server is restarting\n');
//             worker.send('isKilled');
//             break;
//           case 'kill':
//             worker.kill();
//             cluster.fork();
//             break;
//           case 'stop':
//             worker.kill();
//             process.exit(1);
//           default:
//             return;
//         }
//       });

//       cluster.fork();
//     }

//     if (cluster.isWorker) {
//       const strapiInstance = strapi({
//         dir,
//         autoReload: true,
//         serveAdminPanel: watchAdmin ? false : true,
//       });

//       watchFileChanges({
//         dir,
//         strapiInstance,
//         watchIgnoreFiles: adminWatchIgnoreFiles,
//         polling,
//       });

//       process.on('message', (message) => {
//         switch (message) {
//           case 'isKilled':
//             strapiInstance.server.destroy(() => {
//               process.send('kill');
//             });
//             break;
//           default:
//           // Do nothing.
//         }
//       });

//       return strapiInstance.start();
//     }
//   } catch (e) {
//     logger.error(e);
//     process.exit(1);
//   }
// }

// function watchFileChanges({ dir, strapiInstance, watchIgnoreFiles, polling }) {
//   const restart = () => {
//     if (
//       strapiInstance.reload.isWatching &&
//       !strapiInstance.reload.isReloading
//     ) {
//       strapiInstance.reload.isReloading = true;
//       strapiInstance.reload();
//     }
//   };

//   const watcher = chokidar.watch(dir, {
//     ignoreInitial: true,
//     usePolling: polling,
//     ignored: [
//       /(^|[/\\])\../, // dot files
//       /tmp/,
//       '**/admin',
//       '**/admin/**',
//       'extensions/**/admin',
//       'extensions/**/admin/**',
//       '**/documentation',
//       '**/documentation/**',
//       '**/node_modules',
//       '**/node_modules/**',
//       '**/plugins.json',
//       '**/index.html',
//       '**/public',
//       '**/public/**',
//       '**/*.db*',
//       '**/exports/**',
//       ...watchIgnoreFiles,
//     ],
//   });

//   watcher
//     .on('add', (path) => {
//       strapiInstance.log.info(`File created: ${path}`);
//       restart();
//     })
//     .on('change', (path) => {
//       strapiInstance.log.info(`File changed: ${path}`);
//       restart();
//     })
//     .on('unlink', (path) => {
//       strapiInstance.log.info(`File deleted: ${path}`);
//       restart();
//     });
// }
