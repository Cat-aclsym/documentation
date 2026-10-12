import starlight from '@astrojs/starlight';
import {defineConfig} from 'astro/config';
import mermaid from 'astro-mermaid';
import {pluginCollapsibleSections} from '@expressive-code/plugin-collapsible-sections';
import lucode from 'lucode-starlight';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';
import {copyright} from './src/consts';

const site = 'https://cat-aclsym.github.io';
const base = '/documentation';
const repository = 'https://github.com/Cat-aclsym/documentation';
const socialCard = `${site}${base}/social-card.png`;

export default defineConfig({
	site,
	base,
	integrations: [
		/** Must come before Starlight to transform the mermaid code blocks first. */
		mermaid({
			autoTheme: true,
			/** useMaxWidth off keeps the natural 16px text, wide diagrams scroll horizontally (see custom.css). */
			mermaidConfig: {
				fontSize: 16,
				themeVariables: {fontSize: '16px'},
				flowchart: {useMaxWidth: false, nodeSpacing: 30, rankSpacing: 40, padding: 12, wrappingWidth: 220},
				sequence: {useMaxWidth: false, actorMargin: 20, messageMargin: 32, boxMargin: 8, width: 120, wrap: true},
				class: {useMaxWidth: false, padding: 12},
				state: {useMaxWidth: false, nodeSpacing: 40, rankSpacing: 50},
			},
		}),
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
			/** lucode keeps these themes and plugins and only adds its styleOverrides. */
			expressiveCode: {themes: ['github-light', 'dracula'], plugins: [pluginCollapsibleSections()]},
			plugins: [
				lucode({
					navLinks: [{label: 'Documentation', link: `${base}/dashboard/`}],
					footerText: copyright,
					/** Our Footer override wraps the theme's footer to add the copyright line on doc pages. */
					warnOverrides: false,
				}),
				starlightImageZoom(),
				starlightLinksValidator(),
				starlightLlmsTxt(),
			],
			/** One level deep: the lucode mobile drawer only lists the links of top-level groups. */
			sidebar: [
				{slug: 'dashboard'},
				{label: 'Introduction', items: [{autogenerate: {directory: 'introduction'}}]},
				{label: 'Mise en place', items: [{autogenerate: {directory: 'setup'}}]},
				{label: 'Guides', items: [{autogenerate: {directory: 'development/guides'}}]},
				{label: 'Modèles', items: [{autogenerate: {directory: 'development/models'}}]},
				{label: 'Parcours joueur', items: [{autogenerate: {directory: 'development/user-flows'}}]},
				{label: 'Contribuer', items: [{autogenerate: {directory: 'contributing'}}]},
				{label: 'Ressources', items: [{slug: 'useful-links'}, {slug: 'faq'}]},
			],
		}),
	],
});
