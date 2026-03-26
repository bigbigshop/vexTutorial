// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'VEX V5 教學',
  tagline: 'VEX V5 由淺入深',
  favicon: 'img/VEXcodeV5.jpg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://vex.ykyle.eu',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: false,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bigbigshop', // Usually your GitHub org/user name.
  projectName: 'vexTutorial', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
            //'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      sitemap: {
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/tags/**'],
        filename: 'sitemap.xml',
      },
      // 全域 SEO 描述與關鍵字
      metadata: [
        {name: 'keywords', content: 'VEX V5, VEX Robotics, PID 控制, 機械人教學, 程式設計, C++, VEXcode Pro, PROS, Push Back 賽季, 里程計, Odometry'},
        {name: 'description', content: '專業的 VEX V5 機械人教學平台，提供從基礎到進階的機械構造、程式設計、PID 控制理論及實戰模擬器。專為 2025-2026 Push Back 賽季設計。'},
        {name: 'robots', content: 'index, follow'},
        {name: 'og:type', content: 'website'},
        {name: 'og:site_name', content: 'VEX V5 資料分享網'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:title', content: 'VEX V5 機械人全方位教學平台'},
        {name: 'twitter:description', content: '深入淺出的 VEX V5 教程，涵蓋 PID、Odometry、Pure Pursuit 等進階演算法與賽季實戰策略。'},
      ],
      // Replace with your project's social card
      image: 'img/VEXcodeV5.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'VEX V5資料分享網',
        logo: {
          alt: 'VEX V5資料分享網 Logo',
          src: 'img/VEXcodeV5.jpg',
        },
        items: [          
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'VEX V5',
          },
          {
            label: 'Push Back',
            to: '/category/push-back',
            position: 'left',
          },
          /*
          {
            label: '硬件',
            to: '/category/hardware',
            position: 'left',
          },
          {
            label: '軟件',
            to: '/category/software',
            position: 'left',
          },
          {
            label: '感應器',
            to: '/category/sensors',
            position: 'left',
          },
          {
            label: 'CAD',
            to: '/category/cad',
            position: 'left',
          },
          {
            label: '註冊新隊伍',
            to: '/category/register',
            position: 'left',
          },
          {
            label: '世界賽名額',
            to: 'https://kb.roboticseducation.org/hc/en-us/articles/5474199602071-Qualifying-Criteria-for-VEX-Robotics-Competition-Events#viqrc-and-v5rc-spot-allocations-SQp9C',
            position: 'left',
          },
          */
          //{to: '/blog', label: 'Blog', position: 'left'},
          {
            label: 'PID模擬器',
            to: '/pid',
            position: 'left',
          },
          /*
          {
            label: '版本',
            position: 'right',
            items: [
              {
                label: 'v1.0',
                to: '/pidSim',
              },
              {
                label: 'v2.0',
                to: '/intro',
              },
            ],
          },
          */
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'VEX V5資料分享網',
            items: [
              {
                label: 'Tutorial',
                to: '/intro',
              },
            ],
          },
          {
            title: '社群',
            items: [
              {
                label: 'Instagram',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'YouTube',
                href: 'https://discordapp.com/invite/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              /*
              {
                label: 'Blog',
                to: '/blog',
              },*/
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} VEX V5資料分享網, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  // 添加本地搜尋插件
  plugins: [
    [
      'docusaurus-plugin-search-local', // 社區插件名稱
      {
        hashed: true, // 啟用內容哈希，用於緩存
        indexDocs: true, // 明確指定索引文檔
        indexPages: true, // 明確指定索引頁面
        docsRouteBasePath: '/', // 文檔基礎路徑
        // 移除不支援的 highlightSearchTerms
      },
    ],
  ],
};

export default config;
