import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getLastAssistantMessage, parseMessageToResponse } from './chat.util';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AgentMessage } from './models/agent-message.interface';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatEntry } from '../agent/agent';
import { WorkerService } from '../service/worker.service';

@Component({
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    ChatMessageComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  standalone: true,
})
export class ChatComponent {
  worker = inject(WorkerService).worker;
  isLoading = false;
  textArea = new FormControl('');
  progressMessage: string = '';
  message = '';
  messages: ChatEntry[] = [];
  progressBarValue: number = 0;

  startWorker() {
    this.worker.postMessage({ type: 'load' });
  }

  constructor(private router: Router) {}

  async ngOnInit() {
    this.worker.onmessage = (event: MessageEvent<AgentMessage>) => {
      const { type, payload } = event.data;
      switch (type) {
        case 'finalizeStart':
          this.isLoading = true;
          break;
        case 'finalize':
          this.isLoading = false;
          break;
        case 'generatingStart':
          this.isLoading = true;
          break;
        case 'generatingEnd':
          this.isLoading = false;
          break;
        case 'progress':
          this.onProgress(payload);
          break;
        case 'orders':
          this.navigateOrders();
          break;
        case 'response':
          this.processResponse(payload.message, payload);
          break;
        default:
          this.defaultHandler();
      }
    };

    this.startWorker();
  }

  defaultHandler() {}

  sendQuery() {
    this.worker.postMessage({
      type: 'query',
      data: this.textArea.value,
    });

    this.messages.push({ role: 'user', content: this.textArea.value ?? '' });

    this.textArea.setValue('');
  }

  processResponse(message: string, payload: any) {
    const lastMessage = message ?? '';
    let skipMessage = false;

    try {
      const response = parseMessageToResponse(lastMessage);
      const queryParams = { ...response, summarize: true };
      this.router.navigate(['/products'], { queryParams });
      skipMessage = true;
    } catch (e) {
      console.warn('Error while processing response', e);
    }

    if (payload?.metaData?.queryParams) {
      const queryParams = { ...payload?.metaData?.queryParams };
      this.router.navigate([], { queryParams });
    }

    if (!skipMessage && lastMessage) {
      this.messages.push({
        role: 'assistant',
        content: getLastAssistantMessage(lastMessage),
      });
    }
  }

  onProgress(payload: AgentMessage['payload']) {
    if (payload?.message) {
      this.progressMessage = payload.message;
    } else {
      this.progressMessage = '';
    }

    if (payload?.loaded) {
      this.progressBarValue = payload.loaded;
    }
  }

  navigateOrders() {
    this.router.navigate(['/orders']);
  }
}
