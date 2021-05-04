import {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';
import {
  PrismaGeneratorSchema,
  NormalizedPrismaGeneratorSchema,
} from '../utils/schema-types';

// init 命令不会调用prisma init
// 而是直接创建prisma schema到app下，并使用devkit:exec添加相关命令
// init不会执行generate、db push等任一命令

export interface PrismaInitGeneratorSchema
  extends BasicNodeAppGenSchema,
    PrismaGeneratorSchema {}

export interface NormalizedPrismaInitGeneratorSchema
  extends NormalizedPrismaGeneratorSchema {}
