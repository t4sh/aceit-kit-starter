const rawPrefix = process.env.ELEVENTY_PATH_PREFIX || '';
const pathPrefix = rawPrefix ? `/${rawPrefix.replace(/^\/+|\/+$/g, '')}` : '';
const defaultBaseUrl = `http://localhost:3000${pathPrefix}`;

const projectName = '{{PROJECT_NAME}}';
const isTemplate = projectName === '{{' + 'PROJECT_NAME}}';

module.exports = {
  name: process.env.SITE_NAME || (isTemplate ? 'Aceit Kit Starter' : projectName),
  description:
    process.env.SITE_DESCRIPTION ||
    'Eleventy and Tailwind CSS v4 starter for HTML prototypes, with reusable sections and standalone exports.',
  templateUrl: isTemplate ? 'https://github.com/t4sh/aceit-kit-starter/generate' : '',
  author: process.env.SITE_AUTHOR || 'TODO: Your name',
  baseUrl: (process.env.SITE_BASE_URL || defaultBaseUrl).replace(/\/$/, ''),
  pathPrefix,
  environment: process.env.NODE_ENV || 'development',
  indexable: process.env.SITE_INDEXABLE === 'true',
  compiledTailwind: process.env.TAILWIND_MODE === 'compiled',
  analyticsEnabled: process.env.SITE_ANALYTICS_ENABLED === 'true',
};
