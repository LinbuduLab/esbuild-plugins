---
title: Guide
description: How to use this template to create your new VuePress site, deploy
  it to Netlify and connect up your CMS.
permalink: /:slug
---

# How to use this template

## Get started

You do not have to deploy on Netlify to use Netlify CMS, but it is the fastest way to get started. I have also included instructions for deploying to GitHub Pages.

### Deploy to Netlify

The best way to start is to hit this button:

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/petedavisdev/VuePress-with-Netlify-CMS&amp;stack=cms"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify"></a>

This is the fastest way to get your website going. You will initially be hosted on a random URL, but you can add your own domain name later in your "Domain settings" on Netlify.

### Deploy to GitHub Pages

You will need [Node](https://nodejs.org/) installed on your computer.

1. [Create a new repo from this template](https://github.com/petedavisdev/VuePress-with-Netlify-CMS/generate) and clone it to your computer.
2. Run `npm i` to install VuePress.
3. Add `base: "/name-of-your-repo/"` to your **docs/.vuepress/config.js** file.
4. Run `npm run deploy` to deploy your to GitHub pages.

In GitHub, go to your repo settings to see a link to your deployed site. It will be something like `https://username/github.io/name-of-your-repo/`. You can configure a [custom domain](https://help.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site) in GitHub later.

## Setup Netlify CMS

Edit the `backend` config in `.vuepress/public/admin/config.yml` to point at your repo and deploy the change.

```
backend:
  name: github
  repo: username/repo
```

## Login with GitHub OAuth

You can use [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) to authenticate CMS users, but to start off, it's simplest to give yourself access with GitHub OAuth.

1. Go to your [developer settings on GitHub](https://github.com/settings/developers) and add a new OAuth app.
2. Enter the name and full URL of your site and this authorization callback URL:

```
https://api.netlify.com/auth/done
```

3. Click Register application to get your Client ID and Client Secret. You will need these in a moment.
4. In your site Settings, open 'Access control'. Under OAuth, click 'Install provider' and copy in the Client ID and Secret from [GitHub](https://github.com/settings/developers).

You should now be able to visit the /admin page on your website and login with GitHub.

## Install and develop on your computer

You will need [Node](https://nodejs.org/) installed on your computer. Run these commands inside your repo to install vuepress and start a live-reloading development server:

```sh
npm i
npm run dev
```

### Build and deploy

```sh
npm run build
```

After build the folder to deploy is `docs/.vuepress/dist`

## Read the docs

[Official VuePress guide](https://vuepress.vuejs.org/guide/)

[VuePress default theme config](https://vuepress.vuejs.org/theme/default-theme-config.html)

[Netlify CMS docs](https://www.netlifycms.org/docs/intro/)

## Contribute

This template is default VuePress - so please give your [skills](https://github.com/vuejs/vuepress) or [money](https://opencollective.com/vuepress) to the [VuePress team](https://github.com/vuejs/vuepress).

## Author

Pete Davis

- Website: [petedavis.dev](https://petedavis.dev)
- Github: [@petedavisdev](https://github.com/petedavisdev)
- Twitter: [@petedavisdev](https://twitter.com/petedavisdev)
