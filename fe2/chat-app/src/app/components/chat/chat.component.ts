// src/app/components/chat/chat.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
  //standalone: true,
  ///imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService, private authService: AuthService) {}

  async ngOnInit() {
    
    this.loadMessages();
    try {
      let user = await this.authService.getCurrentUser();
      let session = await this.authService.getCurrentSession();
      
      console.log('init Access Token: ' + session?.accessToken);
      console.log('init ID Token: ' + session?.idToken);
      console.log('init User', user?.signInDetails);
    } catch (error) {
      console.error('Error fetching tokens');
    }
  }

  loadMessages() {
    //this.chatService.getMessages().subscribe(data => this.messages = data);
  }

  async testButton() {
    try {
      let user = await this.authService.getCurrentUser();
      let session = await this.authService.getCurrentSession();
      
      console.log('Access Token: ' + session?.accessToken);
      console.log('ID Token: ' + session?.idToken);
      console.log('User', user?.signInDetails);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  }

  // sendMessage() {
  //   this.chatService.sendMessage(this.newMessage)
  //     .subscribe(() => {
  //       this.loadMessages();
  //       this.newMessage = '';
  //     });
  // }
}
