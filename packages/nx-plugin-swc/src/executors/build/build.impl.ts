import { ExecutorContext } from '@nrwl/devkit';
import { bufferUntil, ensureProjectConfig } from 'nx-plugin-devkit';
import {
  map,
  tap,
  mapTo,
  switchMap,
  switchMapTo,
  startWith,
  catchError,
} from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import dayjs from 'dayjs';
import path from 'path';
import { BuildExecutorSchema } from './schema';
import chalk from 'chalk';
import fs from 'fs-extra';
import consola from 'consola';
import swc from '@swc/core';
import { merge, Observable } from 'rxjs';

export function swcRunner() {
  return new Observable((subscriber) => {
    swc.transform("const a:string = 'linbudu';").then((output) => {
      subscriber.next({
        code: output.code,
      });
      subscriber.complete();
    });
  });
}

export default async function buildExecutor(options: BuildExecutorSchema) {
  console.log('Executor ran for Build', options);

  const swcSubscriber: Observable<unknown> = swcRunner().pipe(
    tap((out) => {
      console.log('out: ', out);
    }),
    map(() => {
      return {
        success: true,
      };
    })
  );

  const subscriberGroup = merge(swcSubscriber);

  return eachValueFrom(subscriberGroup);
}
