import {
  Tree,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  joinPathFragments,
  readProjectConfiguration,
  readWorkspaceConfiguration,
} from '@nrwl/devkit';

import type { TypeGraphQLGenSchema, NormalizedGenSchema } from '../schema';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';
import spawn from 'cross-spawn';
import path from 'path';

// https://github.com/2fd/graphdoc/blob/gh-pages/introspection.graphql
// CodeGen:
// URL
// Path to.graphql file

// Glob pattern
// Introspection JSON
// Code file with gql``
// JS file
// String
// GitHub
// Apollo Engine

// GenQL:
// URL
// Path to.graphql file

// GraphQLDoc
// URL
// Path to.graphql file
// JSON
// Code file with gql`` (graphql-tools)

// support schema option only for now
// TODO: get workspace root correctly
// 整体思路
// 根据schema获得：
// GraphQL Schema 文件地址 或 服务器URL
// check-schema
// 对于文件地址，检查是否存在
// 对于URL地址，使用introspection query检测是否有效
// ！需要参考一下无效时的处理
// 默认的生成地址
// genql: generated/genql
// codegen: generated/generated-type.ts introspection.json
// graphqldoc: generated/documentations
// genql：
// spwanSync + cwd
// e.g: genql --schema ./src/graphql/schema.graphql --output ./src/generated

export function normalizeSchema(
  host: Tree,
  schema: TypeGraphQLGenSchema
): NormalizedGenSchema {
  const { app, failFast, genql, code, docs, schema: gqlSchema } = schema;
  console.log('schema: ', schema);

  // check is schema valid
  // path: check does file exists
  // url: check is url alive(use introspection.query)

  const { apps } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);

  if (!appNames.includes(schema.app)) {
    throw new Error(`App ${schema.app} doesnot exist!`);
  }

  const projectName = names(schema.app).fileName;

  const { root, sourceRoot } = readProjectConfiguration(host, app);

  // TODO: get workspace root
  // const { root:ws } = readWorkspaceConfiguration(host);

  const offset = offsetFromRoot(root);

  const workspaceRoot = process.cwd();
  console.log('workspaceRoot: ', workspaceRoot);

  // Tmp
  const absSchemaPath = path.resolve(
    workspaceRoot,
    sourceRoot,
    './app/graphql/schema.graphql'
  );

  console.log('absSchemaPath: ', absSchemaPath);

  const genqlOutputpATH = path.resolve(
    workspaceRoot,
    sourceRoot,
    './app/generated/genql'
  );

  console.log('genqlOutputpATH: ', genqlOutputpATH);

  // FIXME: 暂时全局安装顶替下
  // 到时候可以添加到package.json中？
  // 需要先安装genql相关的包
  // 到时候先检查相应的包是否安装了（项目工作区package.json）
  // 那这样全局的就不能了？不管全局的吧？
  // 不对 spawn命令并不会像npm script那样添加到bin
  // 百度下spawn + pnpx 命令吧
  // const x = spawn(`pnpm i @genql/cli -D`, { shell: true });

  // x.on('message', (me) => {
  //   console.log(me.toString());
  // });

  // x.on('error', (err) => {
  //   console.log(err.toString());
  // });

  // TODO: create genql example?
  const x = spawn.sync(
    `genql --schema ${absSchemaPath} --output ${genqlOutputpATH}`,
    { shell: true }
  );

  console.log(x.stdout?.toString());
  console.log(x.error?.toString());
  console.log(x.stderr?.toString());

  // x.on('message', (me) => {
  //   console.log(me.toString());
  // });

  // x.on('error', (err) => {
  //   console.log(err.toString());
  // });

  return {
    ...schema,
    projectName,
    projectRoot: root,
    projectSourceRoot: sourceRoot,
    offsetFromRoot: offset,
  };
}
