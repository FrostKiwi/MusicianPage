import * as sass from "sass";
import { DateTime } from "luxon";
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

	/* Reload on CSS changes, since 11ty doesn't see them */
	eleventyConfig.addWatchTarget("style");
	eleventyConfig.addWatchTarget("assets");

	/* HTML minifier */
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

	return {
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	};
};