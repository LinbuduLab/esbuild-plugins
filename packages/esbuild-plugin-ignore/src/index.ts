import { ignore as _ignore } from './lib/esbuild-plugin-ignore';

export const ignore = _ignore;

export default ignore;

export {
  IgnorePattern,
  ESBuildPluginIgnoreOption,
} from './lib/esbuild-plugin-ignore';
