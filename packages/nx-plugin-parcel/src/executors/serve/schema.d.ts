import {
  ParcelGeneralParams,
  ParcelServeWatchParams,
  ParcelServeParams,
} from '../utils/types';

export interface ParcelServeSchema
  extends ParcelGeneralParams,
    ParcelServeWatchParams,
    ParcelServeParams {
  cwd: string;
}

export interface NormalizedParcelServeSchema
  extends Partial<ParcelServeSchema> {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
}