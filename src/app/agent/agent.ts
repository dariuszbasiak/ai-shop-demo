import {
  AutoTokenizer,
  AutoModelForCausalLM,
  PreTrainedTokenizer,
  PreTrainedModel,
  TextStreamer,
  Tensor,
} from '@huggingface/transformers';
import { getLastAssistantMessage } from '../chat/chat.util';
import { searchOnlyTool } from './search-product.tool';
import { ordersOnlyTool, ordersTool } from './orders.tools';
import { Tool } from './models/tool.interface';
import { AgentSignals } from './models/agent-signals.class';
export interface ChatEntry {
  role: string;
  content: string;
}

export class CustomerServiceAgent {
  private INIT = false;
  private MODELID = 'Xenova/Phi-3-mini-4k-instruct_fp16';
  private signals!: AgentSignals;
  public tokenizer!: PreTrainedTokenizer;
  public model!: PreTrainedModel;
  public tools: Tool[] = [];

  constructor(signals: AgentSignals) {
    this.signals = signals;
    this.hasShaders().then((hasShaders) => {
      if (hasShaders) {
        this.init();
      } else {
        throw new Error('There is now support for GPU on your device');
      }
    });
  }

  async hasShaders(): Promise<boolean> {
    // Check if support WebGPU and has F16 shaders.
    // @ts-ignore
    if (!!navigator?.gpu) {
      // @ts-ignore
      const adapter = await navigator.gpu.requestAdapter();
      return adapter.features.has('shader-f16');
    }
    return false;
  }

  async init() {
    //Create model and tokenizer instance
    this.tokenizer = await AutoTokenizer.from_pretrained(this.MODELID, {
      legacy: true,
      // @ts-ignore
      progress_callback: this.signals.onTokenizerProgress,
    });

    this.signals.onInitializationStart();

    this.model = await AutoModelForCausalLM.from_pretrained(this.MODELID, {
      dtype: 'q4',
      device: 'webgpu',
      use_external_data_format: true,
      // @ts-ignore
      progress_callback: this.signals.onModelProgress,
    });

    if (!this.INIT) {
      const inputs = await this.tokenizer('a');
      await this.model.generate({ ...inputs, max_new_tokens: 1 });
      this.INIT = true;
    }

    this.tools = [
      {
        name: 'SEARCH_ONLY',
        handler: async (v: string) => {
          return await searchOnlyTool(v, this.model, this.tokenizer);
        },
      },
      ordersTool(this.model, this.tokenizer),
    ];

    this.signals.onInitializationFinish();
  }

  public async getResponse(messages: ChatEntry[], skipPropmt = false) {
    const firstMessage = {
      role: 'assistant',
      content: `
        You are a helpful AI assistant in online shope name TerraFabrics.com,
        
        If user will ask about search product return message with value only "SEARCH_ONLY",
        examples:
        USER: "find me a blue shirt"
        AI: SEARCH_ONLY
        If user will ask about orders product return message with value only "ORDERS_ONLY",
        USER: "what is my order payment status"
        AI: ORDERS_ONLY

        Otherwise return response to the question.
      `,
    };

    if (!skipPropmt) {
      messages = [firstMessage, ...messages];
    }
    const lastMessage = messages[messages.length - 1];

    const inputs = await this.tokenizer.apply_chat_template(messages, {
      add_generation_prompt: false,
      return_dict: true,
    });

    console.log('Start generating', lastMessage.content);

    this.signals.onStartGenerating();
    if (this.signals) {
      this.signals.onStartGenerating();
    }

    const outputs = (await this.model.generate({
      // @ts-ignore
      ...inputs,
      max_new_tokens: 2048,
      temperature: 0.3,
      // streamer,
    })) as Tensor;

    const outputText = this.tokenizer.batch_decode(outputs, {
      skip_prompt: false,
      skip_special_tokens: false,
    });

    console.log('Generating end');

    const selectedTool = this.getToolFromResponse(outputText[0]);

    if (selectedTool) {
      console.log('selected Tool', selectedTool);

      if (selectedTool.onSelection) {
        await selectedTool.onSelection(null, this.signals.customHandler);
      }

      const response = await selectedTool.handler(messages.at(-1)?.content);
      const returnData = {
        message: '',
        metaData: null,
      };

      if (response.message) {
        returnData.message = response.message;
        returnData.metaData = response.metaData;
      } else {
        returnData.message = response;
      }

      if (response.next) {
        this.signals.onStartGenerating();
        response.next().then((message: any) => {
          postMessage(message);
          this.signals.onEndGenerating();
        });
      }
      this.signals?.onEndGenerating();

      return returnData;
    } else {
      this.signals?.onEndGenerating();
      return { message: outputText.at(-1), metaData: null };
    }
  }

  public handleToolSelection(tool: Tool, query: string) {
    tool.handler(query);
  }

  private getToolFromResponse(message: string) {
    let tool: null | Tool = null;

    const lastMessage = getLastAssistantMessage(message);
    for (let item of this.tools) {
      if (lastMessage.includes(item.name)) {
        tool = item;
        break;
      }
    }
    return tool;
  }
}
