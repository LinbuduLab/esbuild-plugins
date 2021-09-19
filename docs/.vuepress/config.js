module.exports = {
  title: 'LinbuduLab Recording',
  description: 'LinbuduLab Recording Site',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'GitHub',
        link: 'https://github.com/LinbuduLab/nx-plugins',
      },
      { text: 'Open Source', link: '/open-source/' },
      { text: 'Extra', link: '/extra/' },
    ],
    sidebar: ['_pages/open-source.md'],
    displayAllHeaders: true,
    lastUpdated: 'Last Updated',
    docsRepo: 'LinbuduLab/nx-plugins',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Help me improve this page!',
    smoothScroll: true,
  },
};
