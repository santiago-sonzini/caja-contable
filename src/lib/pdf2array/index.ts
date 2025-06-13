import * as pdfjs from "pdfjs-dist";
import {pdf2array, Pdf2ArrayOptions} from "./pdf2array";

export {
    pdfjs,
    pdf2array,
};

export type {
    Pdf2ArrayOptions
};

export default pdf2array;


export async function processPdf(pdfFile: ArrayBuffer) {
    // Extract text as a 2D array
    const textArray = await pdf2array(pdfFile);
    return textArray;
    // Now you can process the extracted text
  }
  