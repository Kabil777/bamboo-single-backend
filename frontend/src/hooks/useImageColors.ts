"use client";

import { useEffect, useState } from "react";

interface ImageColors {
	dominant: string;
	palette: string[];
	isLoading: boolean;
}

// Generate a deterministic color from a string (like username)
function stringToColor(str: string): string {
	if (!str) return "rgba(0, 0, 0, 0)";

	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Generate vibrant colors
	const h = hash % 360;
	const s = 65 + (hash % 20); // 65-85% saturation
	const l = 45 + (hash % 15); // 45-60% lightness

	// Convert HSL to RGB
	const hslToRgb = (h: number, s: number, l: number) => {
		s /= 100;
		l /= 100;
		const k = (n: number) => (n + h / 30) % 12;
		const a = s * Math.min(l, 1 - l);
		const f = (n: number) =>
			l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
		return [
			Math.round(255 * f(0)),
			Math.round(255 * f(8)),
			Math.round(255 * f(4)),
		];
	};

	const [r, g, b] = hslToRgb(h, s, l);
	return `rgb(${r}, ${g}, ${b})`;
}

export function useImageColors(
	imageUrl: string | null | undefined,
	fallbackString?: string,
): ImageColors {
	const [colors, setColors] = useState<ImageColors>({
		dominant: fallbackString
			? stringToColor(fallbackString)
			: "rgba(0, 0, 0, 0)",
		palette: [],
		isLoading: !!imageUrl, // Only loading if we have an image URL to extract from
	});

	useEffect(() => {
		if (!imageUrl) {
			console.log("No image URL provided, using fallback color");
			setColors({
				dominant: fallbackString
					? stringToColor(fallbackString)
					: "rgba(0, 0, 0, 0)",
				palette: [],
				isLoading: false,
			});
			return;
		}

		const getCacheKey = (url: string) =>
			`bamboo_image_colors:${encodeURIComponent(url)}`;

		try {
			const cached = localStorage.getItem(getCacheKey(imageUrl));
			if (cached) {
				const parsed = JSON.parse(cached) as {
					dominant: string;
					palette: string[];
				};
				if (parsed?.dominant) {
					setColors({
						dominant: parsed.dominant,
						palette: parsed.palette || [],
						isLoading: false,
					});
					return;
				}
			}
		} catch {
			// Ignore cache errors
		}

		const extractColors = async () => {
			try {
				console.log("Extracting colors from:", imageUrl);

				// Dynamically import ColorThief to avoid SSR issues
				const ColorThiefModule = await import("colorthief");
				const ColorThiefClass = (ColorThiefModule.default || ColorThiefModule) as any;
				const colorThief = new ColorThiefClass();

				// Use proxy API to avoid CORS issues
				const proxyUrl = `/api/extract-colors?url=${encodeURIComponent(imageUrl)}`;

				// Create image element
				const img = new Image();
				img.crossOrigin = "anonymous";

				img.onload = () => {
					try {
						console.log("Image loaded successfully");

						// Check if image is complete
						if (!img.complete || img.naturalWidth === 0) {
							console.log("Image not complete or has no dimensions");
							throw new Error("Image not loaded properly");
						}

						// Get dominant color
						const dominantColor = colorThief.getColor(img);
						console.log("Dominant color extracted:", dominantColor);

						// Get color palette (5 colors)
						const palette = colorThief.getPalette(img, 5);

						const dominantRGB = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
						console.log("Setting dominant color:", dominantRGB);

						setColors({
							dominant: dominantRGB,
							palette: palette.map(
								(color: number[]) =>
									`rgb(${color[0]}, ${color[1]}, ${color[2]})`,
							),
							isLoading: false,
						});
						try {
							localStorage.setItem(
								getCacheKey(imageUrl),
								JSON.stringify({
									dominant: dominantRGB,
									palette: palette.map(
										(color: number[]) =>
											`rgb(${color[0]}, ${color[1]}, ${color[2]})`,
									),
								}),
							);
						} catch {
							// Ignore cache errors
						}
					} catch (error) {
						console.error("Error extracting colors from loaded image:", error);
						setColors({
							dominant: fallbackString
								? stringToColor(fallbackString)
								: "rgba(0, 0, 0, 0)",
							palette: [],
							isLoading: false,
						});
					}
				};

				img.onerror = (e) => {
					console.error(
						"Image failed to load via proxy, using fallback color:",
						e,
					);
					setColors({
						dominant: fallbackString
							? stringToColor(fallbackString)
							: "rgba(0, 0, 0, 0)",
						palette: [],
						isLoading: false,
					});
				};

				img.src = proxyUrl;
			} catch (error) {
				console.error("Error loading ColorThief:", error);
				setColors({
					dominant: fallbackString
						? stringToColor(fallbackString)
						: "rgba(0, 0, 0, 0)",
					palette: [],
					isLoading: false,
				});
			}
		};

		extractColors();
	}, [imageUrl, fallbackString]);

	return colors;
}
