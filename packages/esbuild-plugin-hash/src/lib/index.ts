import hasha from 'hasha';
import fs from 'fs-extra';
import path from 'path';

import type { Plugin } from 'esbuild';
import type { Option } from './normalize-option';
import { fakeBuildResultContent } from './fake';

import { normalizeOption, pattern } from './normalize-option';

export function esbuildHashPlugin(options: Option): Plugin {
  const { dest, algorithm, hashLength, retainOrigin } = normalizeOption(
    options
  );

  let generated = false;

  // waiting for buildEnd hook to be added
  // https://github.com/evanw/esbuild/issues/111#issuecomment-812829551
  return {
    name: 'hash',
    setup(build) {
      const { outdir, outfile = 'main.js' } = build.initialOptions;

      if (!generated) {
        const hashName = hasha
          .fromFileSync(path.join(__dirname, './fake.js'), {
            algorithm: algorithm.toLocaleLowerCase(),
          })
          .substr(0, hashLength);

        const formattedDest = dest.replace(pattern, hashName);
        const originFilePath = path.join(outdir, outfile);

        fs.writeFileSync(formattedDest, fakeBuildResultContent);

        // if (!retainOrigin) {
        //   fs.unlinkSync(originFilePath);
        // }

        generated = true;
      }
    },
  };
}
