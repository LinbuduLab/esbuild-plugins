import { OperatorFunction, zip } from 'rxjs';
import { buffer, delay, filter, share } from 'rxjs/operators';

export function bufferUntil<T>(
  notifier: (value: T) => boolean
): OperatorFunction<T, T[]> {
  return function (source) {
    // 使源ob成为多播 即多个订阅者会共享这一ob
    const shared$ = source.pipe(share());
    // notifier返回true时  until$才会有值发出
    const until$ = shared$.pipe(filter(notifier), delay(0));
    // until$有值发出时 shared$ 才会 emit下一组值
    return shared$.pipe(buffer(until$));
  };
}
