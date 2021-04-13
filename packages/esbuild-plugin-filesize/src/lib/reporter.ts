import chalk from 'chalk';
import boxen from 'boxen';

import type { NormalizedOption, OutputFileSizeInfo } from './normalize-option';

export default function boxenReporter(
  { theme }: NormalizedOption,
  {
    fileSize,
    fileName,
    minifiedSize,
    gzippedSize,
    outputPath,
    buildAt,
  }: OutputFileSizeInfo
): void {
  const [primaryColor, secondaryColor, headerColor] =
    theme === 'dark'
      ? ['green', 'yellow', '#4682B4']
      : ['blackBright', 'blueBright', '#008B45'];

  const headerContainer = headerColor.startsWith('#')
    ? chalk['hex'](headerColor).bold
    : chalk[headerColor].bold;
  const titleContainer = chalk[primaryColor].bold;
  const valueContainer = chalk[secondaryColor];

  const fragments = [
    `${headerContainer('ESBuild-Plugin-FileSize: ')}`,
    `${titleContainer('')}`,
    `${titleContainer('File: ')}${valueContainer(fileName)}`,
    `${titleContainer('File Size: ')}${valueContainer(fileSize)}`,
    `${titleContainer('Minified Size: ')}${valueContainer(minifiedSize)}`,
    `${titleContainer('Gzipped Size: ')}${valueContainer(gzippedSize)}`,
    `${titleContainer('Build At: ')}${valueContainer(buildAt)}`,
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
