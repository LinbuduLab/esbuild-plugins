import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';

import type {
  NormalizedESBuildPluginFileSizeOption,
  OutputFileSizeInfo,
} from './normalize-option';

export function boxenSingleOutputReporter(
  { theme }: NormalizedESBuildPluginFileSizeOption,
  {
    fileSize,
    fileName,
    minifiedSize,
    gzippedSize,
    outputPath,
  }: OutputFileSizeInfo
): void {
  console.log(theme);
  const [primaryColor, secondaryColor, headerColor] =
    theme === 'dark'
      ? ['green', 'yellow', '#4682B4']
      : ['blackBright', '#4682B4', '#008B45'];

  const headerContainer = headerColor.startsWith('#')
    ? chalk['hex'](headerColor).bold
    : chalk[headerColor].bold;

  const titleContainer = chalk[primaryColor].bold;

  const valueContainer = secondaryColor.startsWith('#')
    ? chalk['hex'](secondaryColor)
    : chalk[secondaryColor];

  const fragments = [
    `${headerContainer('ESBuild-Plugin-FileSize: ')}`,
    `${titleContainer('')}`,
    `${titleContainer('File: ')}${valueContainer(fileName)}`,
    `${titleContainer('File Size: ')}${valueContainer(fileSize)}`,
    `${titleContainer('Minified Size: ')}${valueContainer(minifiedSize)}`,
    `${titleContainer('Gzipped Size: ')}${valueContainer(gzippedSize)}`,
  ].join('\n');

  console.log(
    boxen(fragments, {
      padding: 1,
      borderColor: 'cyan',
      borderStyle: 'round',
      align: 'center',
      backgroundColor: theme === 'dark' ? undefined : 'white',
    })
  );
}

// TODO: theme!
export function boxenMultiOutputReporter(
  { theme }: NormalizedESBuildPluginFileSizeOption,
  infos: OutputFileSizeInfo[]
): void {
  const table = new Table({
    head: ['File', 'Origin Output Size', 'Minified Size', 'Gzipped Size'],
  });

  for (const info of infos) {
    const { fileSize, fileName, minifiedSize, gzippedSize, outputPath } = info;
    table.push([fileName, fileSize, minifiedSize, gzippedSize]);
  }
  const [primaryColor, secondaryColor, headerColor] =
    theme === 'dark'
      ? ['green', 'yellow', '#4682B4']
      : ['blackBright', 'blueBright', '#008B45'];

  const headerContainer = headerColor.startsWith('#')
    ? chalk['hex'](headerColor).bold
    : chalk[headerColor].bold;

  console.log(
    boxen(
      `${headerContainer('ESBuild-Plugin-FileSize: ')}\n${table.toString()}`,
      {
        padding: 1,
        borderColor: 'cyan',
        borderStyle: 'round',
        align: 'center',
        backgroundColor: undefined,
      }
    )
  );
}
