// src/app/components/chat/chat.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
  //standalone: true,
  ///imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.chatService.getMessages().subscribe(data => this.messages = data);
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage)
      .subscribe(() => {
        this.loadMessages();
        this.newMessage = '';
      });
  }
}
