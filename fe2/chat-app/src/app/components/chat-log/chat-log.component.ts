import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-log',
  templateUrl: './chat-log.component.html',
  styleUrls: ['./chat-log.component.css'],
})
export class ChatLogComponent implements OnInit {
  @Input() loggedInUser!: string;
  @Input() selectedUser!: any;

  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.fetchChatLog();
  }

  fetchChatLog() {
    this.chatService.getChatLog().subscribe((data) => {
      this.messages = data;
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      this.chatService
        .sendMessage(this.loggedInUser, this.selectedUser.username, this.newMessage)
        .subscribe(() => {
          this.fetchChatLog(); // Refresh chat log after sending
          this.newMessage = ''; // Clear the input field
        });
    }
  }
}
