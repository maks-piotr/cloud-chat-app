import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-log',
  templateUrl: './chat-log.component.html',
  styleUrls: ['./chat-log.component.css'],
})
export class ChatLogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() loggedInUser!: string;
  @Input() selectedUser!: any;

  messages: any[] = [];
  newMessage: string = '';
  private refreshInterval: any; // Reference to the interval

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.fetchChatLog();
    // Set up auto-refresh every second
    this.refreshInterval = setInterval(() => {
      this.fetchChatLog();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.selectedUser?.username + ' from ' + this.loggedInUser);
    if (changes['selectedUser'] && changes['selectedUser'].currentValue) {
      this.fetchChatLog(); // Refetch chat log when selectedUser changes
    }
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
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
