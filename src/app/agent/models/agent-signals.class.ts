export class AgentSignals {
  onStartGenerating!: Function;
  onEndGenerating!: Function;
  onTokenizerProgress!: Function;
  onModelProgress!: Function;
  onInitializationStart!: Function;
  onInitializationFinish!: Function;
  customHandler: Function;

  constructor(
    onStart: Function,
    onEnd: Function,
    onModelProgress: Function,
    onTokenizerProgress: Function,
    onInitializationStart: Function,
    onInitializationFinish: Function,
    customHandler: Function
  ) {
    this.onStartGenerating = onStart;
    this.onEndGenerating = onEnd;
    this.onModelProgress = onModelProgress;
    this.onTokenizerProgress = onTokenizerProgress;
    this.onInitializationStart = onInitializationStart;
    this.onInitializationFinish = onInitializationFinish;
    this.customHandler = customHandler;
  }
}
