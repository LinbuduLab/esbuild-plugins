// let mergedCompilerConfig: ParsedCommandLine | SWCCompileOptions | null = null;

// const tscAsCompiler = compiler === 'tsc';

// build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
//   if (!mergedCompilerConfig) {
//     const configFromFile = tscAsCompiler
//       ? parseTsConfig(tsconfigPath, cwd)
//       : parseSWCConfig(swcrcPath);

//     mergedCompilerConfig = tscAsCompiler
//       ? {
//           ...configFromFile,
//           options: {
//             ...configFromFile.options,
//             ...tscCompilerOptions,
//           },
//         }
//       : merge(defaultSWCCompilerOptions, configFromFile, swcCompilerOptions);

//     console.log('mergedCompilerConfig: ', mergedCompilerConfig);

//     const skipOnTSConfigIndicates =
//       !(mergedCompilerConfig as ParsedCommandLine)?.options
//         ?.emitDecoratorMetadata ||
//       (mergedCompilerConfig as ParsedCommandLine)?.options
//         ?.experimentalDecorators;

//     console.log('skipOnTSConfigIndicates: ', skipOnTSConfigIndicates);

//     // FIXME: swc as compiler & ts config check ?
//     const skipOnSWCConfigIndicates =
//       !(mergedCompilerConfig as SWCCompileOptions).jsc.transform
//         .decoratorMetadata ||
//       !(mergedCompilerConfig as SWCCompileOptions).jsc.parser.decorators;

//     console.log('skipOnSWCConfigIndicates: ', skipOnSWCConfigIndicates);

//     const shouldSkipThisPlugin =
//       !force &&
//       (tscAsCompiler ? skipOnTSConfigIndicates : skipOnSWCConfigIndicates);

//     if (shouldSkipThisPlugin) {
//       verbose && pluginSkipped(path);

//       return;
//     }

//     const fileContent = await fs.readFile(path, 'utf8');

//     const hasDecorator = findDecorators(fileContent);

//     if (!hasDecorator) {
//       verbose && noDecoratorsFound(path);
//       return;
//     }

//     const contents = tscAsCompiler
//       ? tscCompiler(
//           fileContent,
//           (mergedCompilerConfig as ParsedCommandLine).options
//         ).outputText
//       : swcCompiler(fileContent, mergedCompilerConfig as SWCCompileOptions)
//           .code;

//     return { contents };
//   }
// });
