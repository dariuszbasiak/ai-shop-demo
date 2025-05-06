import {
  PreTrainedModel,
  PreTrainedTokenizer,
  Tensor,
} from '@huggingface/transformers';
import {
  getLastAssistantMessage,
  getUserAssistantMessage,
  parseMessageToResponse,
} from '../chat/chat.util';
import { Tool } from './models/tool.interface';

export async function ordersOnlyTool(
  userMessage: string,
  llm: PreTrainedModel,
  tokenizer: PreTrainedTokenizer
) {
  const orders = await getOrders();

  console.log(orders);

  const prompt = `
          User Ask about orders listed below, please answer user question base on these data
        Orders: ${JSON.stringify(orders)}
      `;

  const lastUserMessage = getUserAssistantMessage(userMessage);

  const message = [
    {
      role: 'assistant',
      content: prompt,
    },
    { role: 'user', content: lastUserMessage },
  ];

  const inputs = await tokenizer.apply_chat_template(message, {
    add_generation_prompt: false,
    return_dict: true,
  });

  const outputs = (await llm.generate({
    // @ts-ignore
    ...inputs,
    max_new_tokens: 512,
    temperature: 0.2,
  })) as Tensor;

  const outputText = tokenizer.batch_decode(outputs, {
    skip_prompt: false,
    skip_special_tokens: false,
  });

  const last = getLastAssistantMessage(outputText.at(-1) ?? '');
  const next = async () => {
    const info = await getOrderDetails(last, llm, tokenizer);

    let metaData = { queryParams: {} };

    try {
      metaData.queryParams = parseMessageToResponse(info.at(-1) ?? '');
      console.log('from next', metaData);
      return { type: 'response', payload: { metaData } };
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  return { message: outputText.at(-1), next };
}

async function getOrderDetails(
  text: string,
  llm: PreTrainedModel,
  tokenizer: PreTrainedTokenizer
) {
  const prompt = `
    If {response} contains single id of order please return json with the below structure:
    {orderId: <put here found order id>}
    make sure you your message contains only valid json
  `;

  const message = [
    {
      role: 'assistant',
      content: prompt,
    },
    { role: 'user', content: text },
  ];

  console.log('Looking for id', message);
  const inputs = await tokenizer.apply_chat_template(message, {
    add_generation_prompt: false,
    return_dict: true,
  });

  const outputs = (await llm.generate({
    // @ts-ignore
    ...inputs,
    max_new_tokens: 512,
    temperature: 0.2,
  })) as Tensor;

  const outputText = tokenizer.batch_decode(outputs, {
    skip_prompt: false,
    skip_special_tokens: false,
  });

  return outputText;
}

const getOrders = async () => {
  const response = await fetch('./data/orders.json');
  return response.json();
};

export function ordersTool(
  model: PreTrainedModel,
  tokenizer: PreTrainedTokenizer
): Tool {
  return {
    name: 'ORDERS_ONLY',
    handler: async (v: any) => {
      return await ordersOnlyTool(v, model, tokenizer);
    },
    onSelection: async (value: any, customSignalHandler: Function) => {
      if (customSignalHandler) {
        await customSignalHandler({ type: 'orders', payload: value });
      }
    },
  };
}
