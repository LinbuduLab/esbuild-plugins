import type { OperatorFunction, Observable } from 'rxjs';
import { buffer, delay, filter, share } from 'rxjs/operators';

export function bufferUntil<NotifierArg>(
  notifier: (value: NotifierArg) => boolean
): OperatorFunction<NotifierArg, NotifierArg[]> {
  return (source): Observable<NotifierArg[]> => {
    // 使源ob成为多播 即多个订阅者会共享这一ob
    const shared$ = source.pipe(share());
    // notifier返回true时  until$才会有值发出
    const until$ = shared$.pipe(filter(notifier), delay(0));
    // until$有值发出时 shared$ 才会 emit 下一组值
    return shared$.pipe(buffer(until$));
  };
}
