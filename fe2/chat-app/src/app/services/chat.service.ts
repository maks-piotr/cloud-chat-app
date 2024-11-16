// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Assuming AuthService has a method to get a token

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // private apiUrl = 'http://localhost:8080/api/chat'; // Replace with your actual backend URL

  // constructor(private http: HttpClient, private authService: AuthService) {}

  // // Method to retrieve all chat messages
  // getMessages(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.authService.getToken()}`  // Assumes AuthService has getToken() method
  //   });
  //   return this.http.get(this.apiUrl, { headers });
  // }

  // // Method to send a new chat message
  // sendMessage(content: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.authService.getToken()}`
  //   });
  //   const messageData = { content };
  //   return this.http.post(this.apiUrl, messageData, { headers });
  // }
}
