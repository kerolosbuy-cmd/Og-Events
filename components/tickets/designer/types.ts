export interface TicketDetails {
  qrCode: string;
}

export interface TicketSize {
  width: number;
  height: number;
}

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextElementProperties {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  // New font properties
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textTransform?: string;
  textAlign?: string;
  letterSpacing?: number;
  lineHeight?: number;
  // Text shadow properties
  textShadowX?: number;
  textShadowY?: number;
  textShadowBlur?: number;
  textShadowColor?: string;
}

export interface CustomTextElement {
  id: string;
  content: string;
  position: ElementPosition & TextElementProperties;
}

export interface TicketElements {
  backgroundImage: ElementPosition & { visible: boolean; url?: string };
  qrCode: ElementPosition & {
    visible: boolean;
    backgroundColor: string;
    foregroundColor: string;
    transparentBackground: boolean;
    url?: string;
  };
  customTexts: CustomTextElement[];
}

export type TicketElementKey = keyof TicketElements;
