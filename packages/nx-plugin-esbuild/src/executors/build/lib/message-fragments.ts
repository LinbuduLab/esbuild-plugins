import type { ESBuildRunnerResponse, TscRunnerResponse } from './types';
import {
  warning as warningTxt,
  error as errorTxt,
  plainText,
  success,
  error,
} from './log';

export function collectESBuildRunnerMessages(
  res: ESBuildRunnerResponse,
  messageFragments: string[],
  prefix: string
) {
  const { buildResult, buildFailure } = res;
  if (buildResult?.warnings?.length > 0) {
    messageFragments.push(warningTxt(`${prefix} - Warnings:`));

    buildResult?.warnings?.forEach((warning) => {
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

    messageFragments.push(errorTxt(buildFailure.message));

    //  FIXME: ESBuild API got breaking changes ?
    // buildFailure.errors?.forEach((error) => {
    //   messageFragments.push(errorTxt(error.text));
    // });
    console.log(error('\nESBuild Compilation Failed.\n'));
  } else if (buildResult?.warnings?.length > 0) {
    messageFragments.push(
      success(
        `${prefix} - Build Complete with ${warningTxt(
          String(buildResult?.warnings?.length)
        )} warnings. `
      )
    );
  } else {
    messageFragments.push(
      success(`\n${prefix} - ESBuild Compilation Succeed.`)
    );
  }
}

export function collectTSCRunnerMessages(
  res: TscRunnerResponse,
  messageFragments: string[],
  prefix: string
) {
  const { info, error, end } = res;
  if (error) {
    messageFragments.push(errorTxt(`${prefix} ${error}`));
  } else if (info) {
    if (info.match(/Found\s\d*\serror/)) {
      if (info.includes('Found 0 errors')) {
        messageFragments.push(
          success(`${prefix} ${info.replace(/\r\n/g, '')}`)
        );
      } else {
        messageFragments.push(
          errorTxt(`${prefix} ${info.replace(/\r\n/g, '')}`)
        );
      }
    } else {
      messageFragments.push(success(`${prefix} ${info.replace(/\r\n/g, '')}`));
    }
  }
}
