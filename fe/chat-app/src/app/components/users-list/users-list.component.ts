import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  @Input() loggedInUser!: string;
  users: any[] = [];
  selectedUser: any;

  // Emit selected user to the parent component
  @Output() userSelected = new EventEmitter<any>();

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getUsers().then((observable) => {
      observable.subscribe((data) => {
        this.users = data.filter((user: { username: string; }) => user.username !== this.loggedInUser);
      });
    });

  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.userSelected.emit(user); // Notify parent of the selected user
  }
}
