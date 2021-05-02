// init 命令不会调用prisma init
// 而是直接创建prisma schema到app下，并使用devkit:exec添加相关命令
// init不会执行generate、db push等任一命令
export interface PrismaInitGeneratorSchema {
  // app name/dir to create as project
  app: string;
  directory: string;

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
  clientProvider: string;
  // 创建一个简单的model
  initialSchema: boolean;
  // TODO: 多client支持
  // TODO: generate、db、migrate选项支持
}

export interface NormalizedPrismaInitGeneratorSchema
  extends PrismaInitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
  projectDirectory: string;
  offsetFromRoot: string;

  prismaSchemaPath: string;
  envFilePath: string;
  datasourceUrl: string;
}
