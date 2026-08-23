import { AlignmentPickerPlugin } from "./alignment-picker-plugin";
import { BulletedListPickerPlugin } from "./bulleted-list-picker-plugin";
import { CheckListPickerPlugin } from "./check-list-picker-plugin";
import { CodePickerPlugin } from "./code-picker-plugin";
import { ColumnsLayoutPickerPlugin } from "./columns-layout-picker-plugin";
import { DateTimePickerPlugin } from "./date-time-picker-plugin";
import { DividerPickerPlugin } from "./divider-picker-plugin";
import { EmbedsPickerPlugin } from "./embeds-picker-plugin";
import { HeadingPickerPlugin } from "./heading-picker-plugin";
import { ImagePickerPlugin } from "./image-picker-plugin";
import { NumberedListPickerPlugin } from "./numbered-list-picker-plugin";
import { ParagraphPickerPlugin } from "./paragraph-picker-plugin";
import { QuotePickerPlugin } from "./quote-picker-plugin";
import { TablePickerPlugin } from "./table-picker-plugin";

export const getBaseOptions = () => [
  ParagraphPickerPlugin(),
  HeadingPickerPlugin({ n: 1 }),
  HeadingPickerPlugin({ n: 2 }),
  HeadingPickerPlugin({ n: 3 }),
  BulletedListPickerPlugin(),
  NumberedListPickerPlugin(),
  CheckListPickerPlugin(),
  QuotePickerPlugin(),
  CodePickerPlugin(),
  DividerPickerPlugin(),
  ImagePickerPlugin(),
  TablePickerPlugin(),
  ColumnsLayoutPickerPlugin(),
  DateTimePickerPlugin(),
  AlignmentPickerPlugin({ alignment: "left" }),
  AlignmentPickerPlugin({ alignment: "center" }),
  AlignmentPickerPlugin({ alignment: "right" }),
  AlignmentPickerPlugin({ alignment: "justify" }),
  EmbedsPickerPlugin({ embed: "tweet" }),
  EmbedsPickerPlugin({ embed: "youtube-video" }),
];
