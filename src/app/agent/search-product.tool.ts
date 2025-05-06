import {
  PreTrainedModel,
  PreTrainedTokenizer,
  Tensor,
} from '@huggingface/transformers';
import { getUserAssistantMessage } from '../chat/chat.util';

export async function searchOnlyTool(
  userMessage: string,
  llm: PreTrainedModel,
  tokenizer: PreTrainedTokenizer
) {
  const prompt = `
        User ask for product search. Take message {message} and pares it to JSON format with fallowing scheme:
        {
            "productType": string; // Should be a string one of the type t-shirt, jacket or trousers
            "color": string; // should be just requested color
        }
    
        make sure you return valid json according to the scheme with out markdown and any thing around, just pure json value
        User message is: 
    `;

  const lastUserMessage = getUserAssistantMessage(userMessage);
  console.log('lastUserMessage ', lastUserMessage);

  const message = [
    {
      role: 'assistant',
      content: prompt,
    },
    { role: 'user', content: lastUserMessage },
  ];

  console.log('created prompt shear tool', message);
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

  return outputText.at(-1);
}
