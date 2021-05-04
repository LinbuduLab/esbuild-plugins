import {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';

// init 命令不会调用prisma init
// 而是直接创建prisma schema到app下，并使用devkit:exec添加相关命令
// init不会执行generate、db push等任一命令

// TODO: support useOriginInit 选项，如果指定了这一选项
// 那么所有除app与directory外的其他选项都会被忽略

export interface PrismaSetupGeneratorExtraSchema {
  // src/apps/prisma
  // 必须放置在src内
  prismaDirectory: string;
  // 允许首字母大写
  // x.prisma
  schemaName: string;
  // 默认使用sqlite
  datasourceProvider: 'sqlite' | 'postgresql' | 'mysql' | 'sqlserver';
  // 在项目内创建.env文件，如果为false，则会在workspace root创建
  // TODO: 支持.env.dev这种载入
  useProjectEnv: boolean;
  // 无默认值，当使用sqlite时，使用file:../db.sqlite
  // datasourceUrl: string;
  // 支持prisma-client-js与schema path的相对路径
  clientOutput: string;
  clientProvider: 'prisma-client-js';
  // 创建一个简单的model
  initialSchema: boolean;
  // 生成的项目配置中会使用args来存放所有参数
  collectArgs: boolean;
  // TODO: 多client支持
  // TODO: generate、db、migrate选项支持
}

export interface PrismaSetupGeneratorSchema
  extends BasicNodeAppGenSchema,
    PrismaSetupGeneratorExtraSchema {}

export interface NormalizedPrismaSetupGeneratorSchema
  extends BasicNormalizedAppGenSchema,
    PrismaSetupGeneratorSchema,
    PrismaSetupGeneratorExtraSchema {
  prismaSchemaDir: string;
  prismaSchemaPath: string;
  envFilePath: string;
  datasourceUrl: string;
}
