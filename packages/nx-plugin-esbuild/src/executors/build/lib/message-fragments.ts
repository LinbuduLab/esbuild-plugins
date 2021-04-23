import type { ESBuildRunnerResponse } from './types';
import {
  warning as warningTxt,
  error as errorTxt,
  plainText,
  success,
} from './log';

export function collectESBuildRunnerMessages(
  res: ESBuildRunnerResponse,
  messageFragments: string[],
  prefix: string
) {
  const { buildResult, buildFailure } = res;
  if (buildResult?.warnings.length > 0) {
    messageFragments.push(warningTxt(`${prefix} - Warnings:`));

    buildResult?.warnings.forEach((warning) => {
      const {
        location: { file, line, column, lineText },
        text,
      } = warning;
      messageFragments.push(warningTxt(`${file} ${line}, ${column}:`));
      messageFragments.push(warningTxt(lineText.trim()));
      messageFragments.push(plainText(text));
    });
  }

  if (buildFailure) {
    messageFragments.push(errorTxt(prefix));

    buildFailure.errors.forEach((error) => {
      messageFragments.push(errorTxt(error.text));
    });
  } else if (buildResult?.warnings.length > 0) {
    messageFragments.push(
      success(
        `${prefix} - Build Complete with ${warningTxt(
          String(buildResult?.warnings.length)
        )} warnings. `
      )
    );
  } else {
    messageFragments.push(success(`${prefix} - Build Complete. \n`));
  }
}

export function collectTSCRunnerMessages(
  res: ESBuildRunnerResponse,
  messageFragments: string[],
  prefix: string
) {
  const { buildResult, buildFailure } = res;
  if (buildResult?.warnings.length > 0) {
    messageFragments.push(warningTxt(`${prefix} - Warnings:`));

    buildResult?.warnings.forEach((warning) => {
      const {
        location: { file, line, column, lineText },
        text,
      } = warning;
      messageFragments.push(warningTxt(`${file} ${line}, ${column}:`));
      messageFragments.push(warningTxt(lineText.trim()));
      messageFragments.push(plainText(text));
    });
  }

  if (buildFailure) {
    messageFragments.push(errorTxt(prefix));

    buildFailure.errors.forEach((error) => {
      messageFragments.push(errorTxt(error.text));
    });
  } else if (buildResult?.warnings.length > 0) {
    messageFragments.push(
      success(
        `${prefix} - Build Complete with ${warningTxt(
          String(buildResult?.warnings.length)
        )} warnings. `
      )
    );
  } else {
    messageFragments.push(success(`${prefix} - Build Complete. \n`));
  }
}
