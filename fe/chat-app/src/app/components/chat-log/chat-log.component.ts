import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-log',
  templateUrl: './chat-log.component.html',
  styleUrls: ['./chat-log.component.css'],
})
export class ChatLogComponent implements OnInit, OnChanges {
  @Input() loggedInUser!: string;
  @Input() selectedUser!: any;

  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.fetchChatLog();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.selectedUser?.username + ' from ' + this.loggedInUser);
    if (changes['selectedUser'] && changes['selectedUser'].currentValue) {
      this.fetchChatLog(); // Refetch chat log when selectedUser changes
    }
  }

  fetchChatLog() {
    if (this.loggedInUser && this.selectedUser?.username) {
      this.chatService.getChatLog(this.loggedInUser, this.selectedUser.username).then((observable) => {
        observable.subscribe((data) => {
          this.messages = data;
        });
      });
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      this.chatService.sendMessage(this.loggedInUser, this.selectedUser.username, this.newMessage).then((observable) => {
        observable.subscribe(() => {
          this.fetchChatLog(); // Refresh chat log after sending
          this.newMessage = ''; // Clear the input field
        });
      });
    }
  }
}
