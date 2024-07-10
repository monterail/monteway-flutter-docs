import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: "Monterail's Flutter starter template",
  tagline: 'Kickstart your project with a robust foundation.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'monterail',
  projectName: 'monteway-flutter',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/'
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/monteway-flutter-docs-social-card.jpg',
    navbar: {
      title: 'Flutter starter template',
      logo: {
        alt: "Monterail's logo",
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://github.com/monterail/monteway-flutter',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Blog',
              href: 'https://www.monterail.com/blog/topic/flutter',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/monterail/monteway-flutter',
            },
            {
              label: 'Flutter GitHub Action',
              href: 'https://github.com/monterail/flutter-action',
            },
            {
              label: 'Flutter Tests Assistant VS Code extension',
              href: 'https://marketplace.visualstudio.com/items?itemName=Monterail.flutter-tests-assistant',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Monterail Sp. z o.o.`,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['dart', 'gradle', 'yaml']
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
