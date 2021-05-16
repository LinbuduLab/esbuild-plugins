import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';

import type {
  NormalizedESBuildPluginFileSizeOption,
  OutputFileSizeInfo,
} from './normalize-option';

export function boxenSingleOutputReporter(
  {
    showMinifiedSize,
    showGzippedSize,
    showBrotliSize,
    theme,
  }: NormalizedESBuildPluginFileSizeOption,
  {
    fileSize,
    fileName,
    minifiedSize,
    gzippedSize,
    brotliSize,
    outputPath,
  }: OutputFileSizeInfo
): void {
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
    showMinifiedSize &&
      `${titleContainer('Minified Size: ')}${valueContainer(minifiedSize)}`,
    showGzippedSize &&
      `${titleContainer('Gzipped Size: ')}${valueContainer(gzippedSize)}`,
    showBrotliSize &&
      `${titleContainer('Brotli Size: ')}${valueContainer(brotliSize)}`,
  ]
    .filter(Boolean)
    .join('\n');

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
  {
    showMinifiedSize,
    showGzippedSize,
    showBrotliSize,
    showPluginTitle,
    theme,
  }: NormalizedESBuildPluginFileSizeOption,
  infos: OutputFileSizeInfo[]
): void {
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

  const table = new Table({
    head: [
      'File',
      'Origin Output Size',
      showMinifiedSize && 'Minified Size',
      showGzippedSize && 'Gzipped Size',
      showBrotliSize && 'Brotli Size',
    ]
      .filter(Boolean)
      .map((str) => titleContainer(str)),
  });

  for (const info of infos) {
    const { fileSize, fileName, minifiedSize, gzippedSize, brotliSize } = info;
    table.push(
      [
        fileName,
        fileSize,
        showMinifiedSize && minifiedSize,
        showGzippedSize && gzippedSize,
        showBrotliSize && brotliSize,
      ]
        .filter(Boolean)
        .map((str) => valueContainer(str))
    );
  }

  console.log(
    boxen(
      `${headerContainer(
        showPluginTitle ? 'ESBuild-Plugin-FileSize: \n' : ''
      )}${table.toString()}`,
      {
        padding: 1,
        borderColor: 'cyan',
        borderStyle: 'round',
        align: 'center',
        backgroundColor: theme === 'dark' ? undefined : 'white',
      }
    )
  );
}
