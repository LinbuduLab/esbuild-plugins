// const bundler = watch({
//   input: options.entryFile,
//   output: {
//     dir: options.outputPath,
//   },
//   plugins: [
//     typescriptPlugin({ tsconfig: options.tsconfigPath }),
//     // progressPlugin(),
//     jsonPlugin(),
//     nodeResolvePlugin(),
//   ],
//   watch: {
//     buildDelay: 200,
//   },
// });

// bundler.on('event', async (evt) => {
//   if (evt.code === 'BUNDLE_START') {
//     return {
//       success: true,
//     };
//   }
// });

// bundler.on('event', async (evt) => {
//   if (evt.code === 'BUNDLE_END') {
//     await evt.result.write({});
//     await evt.result.close();

//     return {
//       success: true,
//     };
//   }
// });

// return {
//   success: true,
// };
