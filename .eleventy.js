import * as sass from "sass";
import { DateTime } from "luxon";
import Image from "@11ty/eleventy-img";
import eleventyPluginFilesMinifier from "@sherby/eleventy-plugin-files-minifier";
import _ from 'lodash'

export default function (eleventyConfig) {
	/* Assets */
	eleventyConfig.addPassthroughCopy("assets");

	eleventyConfig.addFilter("dateFormat", (dateObj, format, locale = "en") => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).setLocale(locale).toFormat(format);
	});

	var sassCache = null;
	eleventyConfig.addShortcode("inlineSass", function (scssFilePath) {
		if (sassCache) return sassCache;
		sassCache = sass.compile(scssFilePath, {
			loadPaths: ["node_modules"],
			style: "compressed",
		}).css;
		return sassCache;
	});

	/* Generate Images */
	eleventyConfig.addShortcode("optimizedImageWithLink", async function (src, alt = "") {
		let metadata = await Image(src, {
			widths: [2048],
			formats: ['jpeg'],
			outputDir: eleventyConfig.dir.output + '/assets/images/',
			urlPath: '/assets/images/',
		});

		let image = metadata.jpeg[0];
		let escapedAlt = alt.replace(/"/g, "&quot;");

		return `<a href="${image.url}"><img src="${image.url}" width="${image.width}" height="${image.height}" alt="${escapedAlt}"></a>`;
	});


	/* Generate thumbnails */
	eleventyConfig.addAsyncShortcode("generateThumbnail", async function (src) {
		let image = await Image(src, {
			widths: [150],
			formats: ['jpeg'],
			outputDir: eleventyConfig.dir.output + '/assets/thumbnails/',
		});

		return '/assets/thumbnails/' + image.jpeg[0].filename;
	});

	/* Reload on CSS changes, since 11ty doesn't see them */
	eleventyConfig.addWatchTarget("style");
	eleventyConfig.addWatchTarget("assets");
	eleventyConfig.addWatchTarget("seiten");
	eleventyConfig.addWatchTarget("aktuelles");
	eleventyConfig.addWatchTarget("viewTransition.js");

	/* HTML minifier */
	if (process.env.BUILDMODE === "production") {
		eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
	}

	eleventyConfig.addCollection('postsByYear', (collection) => {
		return _.chain(collection.getAllSorted())
			.filter((item) => 'tags' in item.data && item.data.tags.includes('aktuelles'))
			.groupBy((post) => post.date.getFullYear())
			.toPairs()
			.reverse()
			.value();
	});

	return {
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	};
};