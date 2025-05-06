import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { ChatComponent } from './chat/chat.component';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, ChatComponent, RouterLink, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'ai-shop';
}
