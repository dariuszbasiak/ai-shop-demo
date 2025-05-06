export interface Tool {
  name: string;
  handler: (value: any) => any;
  onSelection?: (value: any, customSignalHandler: Function) => {};
  next?: () => {};
}
