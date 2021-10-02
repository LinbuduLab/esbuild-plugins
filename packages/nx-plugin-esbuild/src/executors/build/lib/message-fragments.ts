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
  prefixCreator: () => string
) {
  const { buildResult, buildFailure } = res;
  if (buildResult?.warnings?.length > 0) {
    messageFragments.push(warningTxt(`${prefixCreator()} - Warnings:`));

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
    messageFragments.push(error('\nESBuild Compilation Failed.\n'));
    messageFragments.push(errorTxt(prefixCreator()));
    messageFragments.push(errorTxt(buildFailure.message));

    buildFailure.errors?.forEach((error) => {
      messageFragments.push(errorTxt(error.text));
    });
  } else if (buildResult?.warnings?.length > 0) {
    messageFragments.push(
      success(
        `${prefixCreator()} - Build Complete with ${warningTxt(
          String(buildResult?.warnings?.length)
        )} warnings. `
      )
    );
  } else {
    messageFragments.push(
      success(`${prefixCreator()} - ESBuild Compilation Succeed.`)
    );
  }
}

export function collectTSCRunnerMessages(
  res: TscRunnerResponse,
  messageFragments: string[],
  prefixCreator: () => string
) {
  const { info, error, end } = res;
  if (error) {
    messageFragments.push(errorTxt(`${prefixCreator()} ${error}`));
  } else if (info) {
    if (info.match(/Found\s\d*\serror/)) {
      if (info.includes('Found 0 errors')) {
        messageFragments.push(
          success(`${prefixCreator()} ${info.replace(/\r\n/g, '')}`)
        );
      } else {
        messageFragments.push(
          errorTxt(`${prefixCreator()} ${info.replace(/\r\n/g, '')}`)
        );
      }
    } else {
      messageFragments.push(
        success(`${prefixCreator()} ${info.replace(/\r\n/g, '')}`)
      );
    }
  }
}
