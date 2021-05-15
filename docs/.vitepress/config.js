const fs = require('fs');
const path = require('path');

/** @type {import("vitepress").UserConfig } */
module.exports = {
  lang: 'en-US',
  title: 'Nx plugins',
  description: 'Nx plugin integration with ...',

  themeConfig: {
    repo: 'linbudu599/nx-plugins',
    docsDir: './',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',
    nav: [
      {
        text: 'Nx Plugins',
        link: '/nx-plugins/index',
      },
      {
        text: 'Extra Plugins',
        link: '/extra-plugins/index',
      },
      {
        text: 'Developing Guide',
        link: '/guide/index',
        activeMatch: '^/$|^/guide/',
      },
    ],
    sidebar: {
      '/nx-plugins/': [
        {
          text: 'Introduction',
          children: [
            { text: 'Summary Introductions', link: '/nx-plugins/index' },
            { text: 'Nx-Plugin-ESBuild', link: '/nx-plugins/esbuild' },
            { text: 'Nx-Plugin-Vite', link: '/nx-plugins/vite' },
            { text: 'Nx-Plugin-Prisma', link: '/nx-plugins/prisma' },
            { text: 'Nx-Plugin-SWC', link: '/nx-plugins/swc' },
            { text: 'Nx-Plugin-TypeGraphQL', link: '/nx-plugins/type-graphql' },
            { text: 'Nx-Plugin-Devkit', link: '/nx-plugins/devkit' },
            { text: 'Nx-Plugin-Workspace', link: '/nx-plugins/workspace' },
            { text: 'Nx-Plugin-Midway', link: '/nx-plugins/midway' },
            { text: 'Nx-Plugin-Parcel', link: '/nx-plugins/parcel' },
            { text: 'Nx-Plugin-Koa', link: '/nx-plugins/koa' },
            { text: 'Nx-Plugin-Rollup', link: '/nx-plugins/rollup' },
            { text: 'Nx-Plugin-Umi', link: '/nx-plugins/umi' },
            { text: 'Nx-Plugin-VitePress', link: '/nx-plugins/vitepress' },
            { text: 'Nx-Plugin-VuePress', link: '/nx-plugins/vuepress' },
            { text: 'Nx-Plugin-Dumi', link: '/nx-plugins/dumi' },
            { text: 'Nx-Plugin-Ice', link: '/nx-plugins/ice' },
            { text: 'Nx-Plugin-Release', link: '/nx-plugins/release' },
            { text: 'Nx-Plugin-Serverless', link: '/nx-plugins/serverless' },
          ],
        },
      ],
      '/extra-plugins/': [
        {
          text: 'Extra Plugins',
          children: [
            { text: 'Summary Introductions', link: '/extra-plugins/index' },
            { text: 'ESBuild Plugins', link: '/extra-plugins/esbuild' },
            { text: 'Rollup Plugins', link: '/extra-plugins/rollup' },
            { text: 'Snowpack Plugins', link: '/extra-plugins/snowpack' },
            { text: 'Vite Plugins', link: '/extra-plugins/vite' },
            { text: 'Umi Plugins', link: '/extra-plugins/umi' },
            { text: 'Parcel Plugins', link: '/extra-plugins/parcel' },
          ],
        },
      ],
      '/guide/': [
        {
          text: 'Developing Duide',
          children: [
            { text: 'Summary Introductions', link: '/guide/index' },
            { text: 'Bundler', link: '/guide/bundler' },
            { text: 'Framework', link: '/guide/framework' },
            { text: 'NodeJS', link: '/guide/node' },
          ],
        },
      ],
      '/': [
        {
          text: 'Introduction',
          children: [
            { text: 'Summary Introductions', link: '/nx-plugins/index' },
            { text: 'Nx-Plugin-ESBuild', link: '/nx-plugins/esbuild' },
            { text: 'Nx-Plugin-Vite', link: '/nx-plugins/vite' },
            { text: 'Nx-Plugin-Prisma', link: '/nx-plugins/prisma' },
            { text: 'Nx-Plugin-SWC', link: '/nx-plugins/swc' },
            { text: 'Nx-Plugin-TypeGraphQL', link: '/nx-plugins/type-graphql' },
          ],
        },
      ],
    },
  },
};
