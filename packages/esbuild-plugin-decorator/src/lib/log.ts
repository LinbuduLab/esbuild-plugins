import { inspect } from 'util';

export function printDiagnostics(...args: any[]) {
  console.log(inspect(args, false, 10, true));
}
