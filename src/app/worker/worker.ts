import { ProgressInfo } from '@huggingface/transformers';
import { CustomerServiceAgent } from '../agent/agent';
import { AgentSignals } from '../agent/models/agent-signals.class';
let agent: CustomerServiceAgent;
const cb = (v: any) => {};

const onFinalizeStart = () => {
  postMessage({ type: 'finalizeStart' });
};
const onFinalize = () => {
  postMessage({ type: 'finalize' });
};

const signals = new AgentSignals(
  onStart,
  onEnd,
  onProgress,
  onProgress,
  onFinalizeStart,
  onFinalize,
  customHandler
);

addEventListener(
  'message',
  async (event: MessageEvent<{ type: string; data: any }>) => {
    console.log(event);
    const { type, data } = event.data;
    switch (type) {
      case 'load':
        await loadAgent();
        break;
      case 'query':
        await getResponse(data);
        break;
      case 'summarize':
        await getResponse(data, true);
        break;
      default:
        console.log('unknown message', event);
    }
    postMessage({ type: 'progress', data: 'any' });
  }
);

const loadAgent = async () => {
  agent = new CustomerServiceAgent(signals);
};

const getResponse = async (query: string, skipPropmt = false) => {
  const response = await agent.getResponse(
    [{ role: 'user', content: query }],
    skipPropmt
  );

  postMessage({
    type: 'response',
    payload: response,
  });
};

const progressStore = new Map();
const loadStore = new Map();

function onStart() {
  postMessage({ type: 'generatingStart', payload: null });
}
function onEnd() {
  postMessage({ type: 'generatingEnd', payload: null });
}

async function customHandler(value: { type: string; payload: any }) {
  if (value.type === 'orders') {
    postMessage({
      type: 'orders',
      payload: value.payload,
    });
  }
}

interface ProgressInfo {
  total: number;
  loaded: number;
  file: string;
}

function onProgress(progress: ProgressInfo) {
  if (typeof progress.total === 'number') {
    progressStore.set(progress.file, progress.total);
    loadStore.set(progress.file, progress.loaded);

    const total = getSumTotal(progressStore);
    const totalLoaded = getSumTotal(loadStore);

    postMessage({
      type: 'progress',
      payload: { loaded: (totalLoaded / total) * 100 },
    });
  }
}

function getSumTotal(store: Map<string, number>) {
  return Array.from(store.values()).reduce((a, b) => a + b, 0);
}
