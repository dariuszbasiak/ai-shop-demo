export const getLastAssistantMessage = (message: string) => {
  const assistantTag = '<|assistant|>';
  const endTag = '<|end|>';

  const lastAssistantTagIndex = message.lastIndexOf(assistantTag);
  const lastEndTagIndex = message.lastIndexOf(endTag);

  let value = message.slice(
    lastAssistantTagIndex + assistantTag.length,
    lastEndTagIndex
  );

  if (value === '') {
    const copy = message;
    const withOutSuffix = copy.slice(0, message.lastIndexOf(assistantTag));

    value = withOutSuffix.slice(
      withOutSuffix.lastIndexOf(assistantTag) + assistantTag.length
    );
  }

  return value;
};

export const getUserAssistantMessage = (message: string) => {
  const userTag = '<|user|>';
  const endTag = '<|end|>';

  const lastAssistantTagIndex = message.lastIndexOf(userTag);
  const lastEndTagIndex = message.lastIndexOf(endTag);

  return message.slice(lastAssistantTagIndex + userTag.length, lastEndTagIndex);
};

export const parseMessageToResponse = (message: string) => {
  const jsonTag = '```json';
  const endTag = '```';

  message = getLastAssistantMessage(message);
  const lastJsonTagIndex = message.lastIndexOf(jsonTag);
  const lastEndTagIndex = message.lastIndexOf(endTag);

  if (lastJsonTagIndex > -1) {
    try {
      const value = message.slice(
        lastJsonTagIndex + jsonTag.length,
        lastEndTagIndex
      );

      return JSON.parse(value);
    } catch (e) {
      console.warn('Error while processing json formater');
      return undefined;
    }
  }

  return JSON.parse(message);
};
