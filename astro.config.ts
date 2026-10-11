import starlight from '@astrojs/starlight';
import {defineConfig} from 'astro/config';
import mermaid from 'astro-mermaid';
import starlightLinksValidator from 'starlight-links-validator';

const repository = 'https://github.com/Cat-aclsym/documentation';

export default defineConfig({
	site: 'https://cat-aclsym.github.io',
	base: '/documentation',
	integrations: [
		/** Must come before Starlight to transform the mermaid code blocks first. */
		mermaid({autoTheme: true}),
		starlight({
			title: "Cat'aclysm",
			description: "Documentation technique de Cat'aclysm",
			locales: {root: {label: 'Français', lang: 'fr'}},
			favicon: '/favicon.ico',
			logo: {src: './src/assets/img/logo.svg'},
			social: [{icon: 'github', label: 'GitHub', href: repository}],
			editLink: {baseUrl: `${repository}/edit/main/`},
			lastUpdated: true,
			customCss: ['./src/styles/custom.css'],
			components: {Footer: './src/components/Footer.astro'},
			expressiveCode: {themes: ['github-light', 'dracula']},
			plugins: [starlightLinksValidator()],
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
