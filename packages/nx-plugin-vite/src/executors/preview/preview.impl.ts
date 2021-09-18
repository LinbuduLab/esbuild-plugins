import { VitePreviewSchema } from './schema';
import { Observable, from } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import execa from 'execa';
import { startVitePreview } from './lib/vite-preview';

// 好家伙，vite没暴露出preview，直接打包进cli.js了
// 那就只能使用笨比方式了

export default function runExecutor(schema: VitePreviewSchema) {
  return eachValueFrom(startVitePreview(schema).pipe(map((res) => res)));
}
