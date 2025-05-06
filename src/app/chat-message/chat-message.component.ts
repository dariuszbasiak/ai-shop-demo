import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChatEntry } from '../agent/agent';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [MatIconModule, MarkdownModule, NgClass],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
  @Input() message: ChatEntry | null = null;
}
