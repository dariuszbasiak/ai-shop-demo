export interface AgentMessage {
  type: AgentMessageType;
  payload: { message: string; metaData: any; loaded: number };
}

export type AgentMessageType =
  | 'response'
  | 'progress'
  | 'load'
  | 'finalizeStart'
  | 'finalize'
  | 'orders'
  | 'generatingEnd'
  | 'generatingStart';
