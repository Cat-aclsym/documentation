import starlight from '@astrojs/starlight';
import {defineConfig} from 'astro/config';
import mermaid from 'astro-mermaid';
import {pluginCollapsibleSections} from '@expressive-code/plugin-collapsible-sections';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';

const site = 'https://cat-aclsym.github.io';
const base = '/documentation';
const repository = 'https://github.com/Cat-aclsym/documentation';
const socialCard = `${site}${base}/social-card.png`;

export default defineConfig({
	site,
	base,
	integrations: [
		/** Must come before Starlight to transform the mermaid code blocks first. */
		mermaid({autoTheme: true}),
		starlight({
			title: "Cat'aclysm",
			description: "Documentation technique de Cat'aclysm",
			locales: {root: {label: 'Français', lang: 'fr'}},
			favicon: '/favicon.jpg',
			logo: {src: './src/assets/img/logo.jpg'},
			social: [{icon: 'github', label: 'GitHub', href: repository}],
			editLink: {baseUrl: `${repository}/edit/main/`},
			lastUpdated: true,
			/** docs/404.md is served by the catch-all route, the injected 404 route would conflict with it. */
			disable404Route: true,
			customCss: ['./src/styles/custom.css'],
			components: {Footer: './src/components/Footer.astro'},
			head: [
				{tag: 'meta', attrs: {property: 'og:image', content: socialCard}},
				{tag: 'meta', attrs: {property: 'og:image:width', content: '1200'}},
				{tag: 'meta', attrs: {property: 'og:image:height', content: '630'}},
				{tag: 'meta', attrs: {name: 'twitter:image', content: socialCard}},
			],
			expressiveCode: {themes: ['github-light', 'dracula'], plugins: [pluginCollapsibleSections()]},
			plugins: [starlightImageZoom(), starlightLinksValidator(), starlightLlmsTxt()],
			sidebar: [
				{slug: 'dashboard'},
				{label: 'Introduction', items: [{autogenerate: {directory: 'introduction'}}]},
				{label: 'Setup', items: [{autogenerate: {directory: 'setup'}}]},
				{
					label: 'Development',
					items: [
						{label: 'Guides', items: [{autogenerate: {directory: 'development/guides'}}]},
						{label: 'Models', items: [{autogenerate: {directory: 'development/models'}}]},
						{label: 'User Flows', items: [{autogenerate: {directory: 'development/user-flows'}}]},
					],
				},
				{slug: 'git-workflow'},
				{slug: 'useful-links'},
				{slug: 'writing-guidelines'},
				{slug: 'faq'},
			],
		}),
	],
});
