/**
 * Exported utilities for handling canvas configurations and drawing operations.
 * @param CanvasConfig The configuration options for the canvas.
 * @param radiusBorder The function for applying a radius border to the canvas.
 * @param circularBorder The function for applying a circular border to the canvas.
 * @param drawBackgroundColor The function for drawing a solid background color on the canvas.
 * @param drawBackgroundGradient The function for drawing a gradient background on the canvas.
 * @param customBackground The function for drawing a custom background image on the canvas.
 */



import { CanvasConfig, ImageProperties, TextObject, ImageObject, GIFOptions, GIFResults, CustomOptions, cropOptions } from "./types";
import { radiusBorder } from "./radius";
import { circularBorder } from "./circular";
import { drawBackgroundColor, drawBackgroundGradient, customBackground } from "./bg";
import { applyRotation, imageRadius, applyStroke, applyShadow, objectRadius, drawShape} from './imageProperties'
import { drawText, WrappedText } from "./textProperties";
import { loadImages, resizingImg, converter, applyColorFilters, imgEffects, cropOuter, cropInner, detectColors, removeColor, bgRemoval } from './general functions';
import { customLines } from "./customLines";
import { verticalBarChart, pieChart, lineChart } from './charts'

export {
    CanvasConfig,
    ImageProperties,
    TextObject,
    ImageObject,
    GIFOptions,
    GIFResults,
    CustomOptions,
    cropOptions,
    radiusBorder,
    customLines,
    circularBorder,
    drawBackgroundColor,
    drawBackgroundGradient,
    customBackground,
    applyRotation,
    imageRadius,
    applyStroke,
    applyShadow,
    objectRadius,
    drawShape,
    drawText,
    WrappedText,
    loadImages,
    resizingImg,
    converter,
    applyColorFilters,
    imgEffects,
    verticalBarChart,
    pieChart,
    lineChart,
    cropInner,
    cropOuter,
    detectColors,
    removeColor,
    bgRemoval
};
