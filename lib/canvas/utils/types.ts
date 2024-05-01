/**
 * Configuration options for the canvas.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {string} customBg - The URL or local path to the custom background image.
 * @param {string} colorBg - The background color of the canvas.
 * @param {object} gradientBg - The gradient settings for the canvas background.
 * @param {number | string} borderRadius - The border radius of the canvas.
 */
export interface CanvasConfig {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    customBg?: string;
    colorBg?: string | 'transparent';
    gradientBg?: {
        type?: string | 'linear' | 'radial' | undefined;
        startX?: number;
        startY?: number;
        startRadius?: number;
        endRadius?: number;
        endX?: number;
        endY?: number;
        colors?: { stop?: number; color?: string }[];
    }; 
    stroke?: {
        color?: string;
        width?: number; 
        position?: number;
        borderRadius?: number | string | "circular"; 
    };
    shadow?: {
        color?: string;
        offsetX?: number;
        offsetY?: number;
        blur?: number;
        opacity?: number;
    };
    rotation?: number;
    borderRadius?: number | string | "circular";
};

/**
 * Properties of an image or shape to be drawn on the canvas.
 * @param {string} source - URL or path to the image or shape name.
 * @param {number} width - The width of the image or shape.
 * @param {number} height - The height of the image or shape.
 * @param {number} x - The x-coordinate of the image or shape.
 * @param {number} y - The y-coordinate of the image or shape.
 * @param {boolean} isFilled - Whether the shape is filled or not (Only applicable if source is a shape name).
 * @param {string} color - The color of the shape (Only applicable if source is a shape name).
 * @param {object} gradient - The gradient settings for the shape (Only applicable if source is a shape name).
 * @param {number} rotation - Rotation angle in degrees.
 * @param {number | string} borderRadius - The border radius of the image or shape.
 * @param {object} stroke - The stroke properties.
 * @param {string} stroke.color - The color of the stroke.
 * @param {number} stroke.width - The width of the stroke.
 * @param {number} stroke.position - Space between stroke and the image it's stroked on.
 * @param {number | string} stroke.borderRadius - The border radius of the stroke.
 * @param {object} shadow - The shadow properties.
 * @param {string} shadow.color - The color of the shadow.
 * @param {number} shadow.offsetX - The horizontal offset of the shadow.
 * @param {number} shadow.offsetY - The vertical offset of the shadow.
 * @param {number} shadow.blur - The blur radius of the shadow.
 * @param {number} shadow.opacity - The opacity of the shadow.
 * @param {number | string} shadow.borderRadius - The border radius of the shadow.
 */
export interface ImageProperties {
    source: string; 
    width?: number; 
    height?: number; 
    x?: number;
    y?: number;
    isFilled?: boolean;
    color?: string; 
    gradient?: {
        type?: string | 'linear' | 'radial' | undefined;
        startX?: number;
        startY?: number;
        startRadius?: number;
        endRadius?: number; 
        endX?: number;
        endY?: number;
        colors?: { stop?: number; color?: string }[]; 
    };
    rotation?: number; 
    borderRadius?: number | string | "circular" ;
    stroke?: {
        color?: string;
        width?: number; 
        position?: number;
        borderRadius?: number | string | "circular"; 
    };
    shadow?: {
        color?: string; 
        offsetX?: number;
        offsetY?: number; 
        blur?: number; 
        opacity?: number; 
        borderRadius?: number | string | "circular"; 
    };
};

export interface TextObject {
    text?: string;
    x?: number;
    y?: number;
    fontPath?: string;
    fontName?: string;
    fontSize?: number;
    isBold?: boolean;
    color?: string;
    maxWidth?: number;
    lineHeight?: number;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    shadow?: {
        color?: string;
        offsetX?: number;
        offsetY?: number;
        blur?: number;
        opacity?: number;
    };
    stroke?: {
        color?: string;
        width?: number;
    };
}

/**
 * Represents an image object.
 * @param source The source of the image.
 * @param isRemote Indicates whether the image is remote or local.
 */
export interface ImageObject {
    source: string;
    isRemote: boolean;
}

/**
 * Options for creating a GIF.
 * @param outputFormat The format of the output ('file', 'base64', 'attachment', or 'buffer').
 * @param outputFile The file path if output format is 'file'.
 * @param width The width of the GIF.
 * @param height The height of the GIF.
 * @param repeat The number of times the GIF should repeat.
 * @param quality The quality of the GIF.
 * @param delay The delay between frames in milliseconds.
 * @param watermark The watermark settings.
 * @param textOverlay The text overlay settings.
 * @param basDir The base directory for files.
 */
export interface GIFOptions {
    outputFormat: 'file' | 'base64' | 'attachment' | 'buffer' | string;
    outputFile?: string;
    width?: number;
    height?: number;
    repeat?: number;
    quality?: number;
    delay?: number;
    watermark?: {
        enable: boolean;
        url: string;
    };
    textOverlay?: {
        text: string;
        fontName?: string;
        fontPath?: string;
        fontSize?: number;
        fontColor?: string;
        x?: number;
        y?: number;
    };
    basDir?: any;
}

/**
 * Results of creating a GIF.
 * @param buffer The buffer containing the GIF data.
 * @param base64 The base64 representation of the GIF.
 * @param attachment The attachment containing the GIF stream.
 */
export interface GIFResults {
    buffer?: Buffer;
    base64?: string;
    attachment?: { attachment: NodeJS.ReadableStream | any; name: string };
}

/**
 * Custom options for drawing.
 * @param startCoordinates The starting coordinates.
 * @param endCoordinates The ending coordinates.
 * @param lineStyle The style of the line.
 */
export interface CustomOptions {
    startCoordinates: {
        x: number;
        y: number;
    };
    endCoordinates: {
        x: number;
        y: number;
    };
    lineStyle?: {
        width?: number;
        color?: string;
        lineRadius?: number | string;
        stroke?: {
            color?: string;
            width?: number;
            lineRadius?: number | string;
        };
        shadow?: {
            offsetX?: number;
            offsetY?: number;
            blur?: number;
            color?: string;
            lineRadius?: number | string;
        };
    };
}

export interface ChartData {
    height?: number;
    width?: number;
    widthPerc?: number;
    heightPerc?: number;
    title?: {
        title?: string;
        color?: string;
        size?: number;
    };
    bg?: {
        image?: string;
        bgColor?: string;
    };
    grid?: {
        enable: boolean;
        color?: string;
        width?: number;
    };
    axis?: {
        color?: string;
        size?: number;
    };
    labels?: {
        color?: string;
        fontSize?: number;
    };
}

export interface DataPoint {
    label: string;
    barColor?: string;
    stroke?: { 
        color?: string;
        width?: number;
    }
    value: number;
    position: {
        startsXLabel: number;
        endsXLabel: number;
    };
}

export interface barChart_1 {
    chartData?: ChartData;
    xLabels: number[];
    yLabels: number[];
    data: {
        xAxis: DataPoint[];
        yAxis: number[];
        keys?: { [color: string]: string };
        keyColor?: string;
        xTitle?: string;
        yTitle?: string;
        labelStyle?: {
            color?: string;
            size?: number;
        };
    };
}


export interface bgConfig {
    width?: number;
    height?: number;
    bgcolor?: string;
  }
  
export interface KeyBoxConfig {
    width?: number;
    height?: number;
    radius?: number;
    bgcolor?: string;
    x?: number;
    y?: number;
    content?: KeyBoxContent;
  }
  
  export interface KeyBoxContent {
    keyTitle?: {
      text?: string;
      fontSize?: number;
      x?: number;
      y?: number;
    };
    keys?: {
      x?: number;
      y?: number;
      fontSize?: number;
    };
  }
  
export interface StrokeConfig {
    color?: string;
    size?: number;
  }
  
export interface TitleConfig {
    text?: string;
    color?: string;
    fontSize?: number;
    x?: number;
    y?: number;
  }
  
export interface PieDataConfig {
    x?: number;
    y?: number;
    stroke?: StrokeConfig;
    title?: TitleConfig;
    boxes?: {
      labelDistance?: number;
      width?: number;
      height?: number;
      fontSize?: number;
      labelColor?: string;
      boxColor?: string;
      strokeColor?: string;

    };
    radius?: number;
  }
  
export interface PieConfig {
    canvas?: bgConfig;
    keyBox?: KeyBoxConfig;
    pieData?: PieDataConfig;
  }
  
export  interface DataItem {
    label: string;
    color: string;
    value: number;
    key: string;
  }
  
export  interface PieChartData {
    data?: DataItem[];
    pieConfig?: PieConfig;
  }

  
export interface DataPoint {
    label: string;
    y: number;
}

export interface LineChartConfig {
    yLabels: string[];
    fillArea: { color: string }[];
    lineColor: string[];
    plot: {
        enable: boolean;
        color: string[];
        size: number;
    };
    lineTension: number[];
    grid: {
        type: 'vertical' | 'horizontal' | 'both' | string;
        color: string;
        width: number;
    };
    keys: { [color: string]: string };
    keysConfig: {
        radius?: number;
        keyPadding?: number;
        textPadding?: number;
        lineWidth?: number;
        fontColor?: string;
    }
    canvas?: {
        bgColor?: string;
        fontColor?: string;
        fontSize?: number;
        width?: number;
        height?: number;
        image?: string;
    };
}



export interface cropCoordinate {
    from: { x: number; y: number };
    to: { x: number; y: number };
    tension?: number;
}

export interface cropOptions {
    coordinates: cropCoordinate[];
    imageSource: string;
    crop: 'inner' | 'outer' | string;
    radius: 'circular' | number | string;
}