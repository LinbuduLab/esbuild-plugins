const fs = require('fs-extra');
const path = require('path');

const NX_PLUGIN_LIST = [
  {
    title: 'Overview',
    path: '/nx/',
  },
  {
    title: 'ESBuild',
    path: 'esbuild',
  },
  {
    title: 'Vite',
    path: 'vite',
  },
  {
    title: 'Astro',
    path: 'astro',
  },
  {
    title: 'Snowpack',
    path: 'snowpack',
  },
  {
    title: 'Prisma',
    path: 'prisma',
  },
  // {
  //   title: 'TypeGraphQL',
  //   path: 'type-graphql',
  // },
  {
    title: 'Devkit',
    path: 'devkit',
  },
  {
    title: 'Workspace',
    path: 'workspace',
  },
];

const DERIVED_PLUGIN_LIST = [
  {
    title: 'Overview',
    path: '/derived/',
  },
  {
    title: 'ESBuild Plugins',
    path: 'esbuild',
  },
  {
    title: 'Snowpack Plugins',
    path: 'snowpack',
  },
];

module.exports = {
  title: 'LinbuduLab: Nx Plugins',
  logo: '/media/logo.jpeg',
  description: 'Nx plugin integrations with Bundler / Library / Framework.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Nx Plugins', link: '/nx/' },
      { text: 'Derived Plugins', link: '/derived/' },
      { text: 'Develop Guide', link: '/guiding/' },
      {
        text: 'Learn Nx',
        link: 'https://nx.dev',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/LinbuduLab/nx-plugins',
      },
    ],
    displayAllHeaders: false,
    sidebar: {
      '/nx/': NX_PLUGIN_LIST,
      '/derived/': DERIVED_PLUGIN_LIST,
      '/guiding/': 'auto',
    },
    lastUpdated: 'Last Updated',
    nextLinks: true,
    prevLinks: true,
    // repo: 'LinbuduLab/nx-plugins',
    // repoLabel: 'Contribute!',
    docsRepo: 'LinbuduLab/nx-plugins',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Help me improve this page!',
    smoothScroll: true,
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'G-NE3SMQE6C5',
      },
    ],
  ],
};
