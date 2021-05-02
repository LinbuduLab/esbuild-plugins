import dotenv from 'dotenv';

export function processEnv(color: boolean) {
  const env = { ...process.env };
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
      console.log('e: ', e);
    }
  }
}
