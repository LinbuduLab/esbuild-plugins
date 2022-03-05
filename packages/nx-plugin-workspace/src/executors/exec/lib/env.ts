import dotenv from 'dotenv';
import npmRunPath from 'npm-run-path';

export function processEnv(color: boolean, useLocalPackage = false) {
  const env = useLocalPackage
    ? {
        ...process.env,
        // FIXME: no longer needed in favor of execa.preferLocal
        ...npmRunPath.env(),
      }
    : { ...process.env };
  if (color) {
    env.FORCE_COLOR = `${color}`;
  }

  return env;
}

export function loadEnvVars(path?: string) {
  if (path) {
    const result = dotenv.config({ path });
    if (result.error) {
      throw result.error;
    }
  } else {
    try {
      dotenv.config();
    } catch (e) {
      console.error(e);
    }
  }
}
