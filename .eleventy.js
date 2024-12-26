import * as sass from "sass";
import { DateTime } from "luxon";
import Image from "@11ty/eleventy-img";
import eleventyPluginFilesMinifier from "@sherby/eleventy-plugin-files-minifier";

export default function (eleventyConfig) {
	/* Assets */
	eleventyConfig.addPassthroughCopy("assets");

	eleventyConfig.addFilter("dateFormat", (dateObj, format) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
	});

	eleventyConfig.addShortcode("inlineSass", function (scssFilePath) {
		return sass.compile(scssFilePath,
			{
				loadPaths: ["node_modules"],
				style: "compressed",
			}).css;
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

	/* HTML minifier */
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

	return {
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	};
};