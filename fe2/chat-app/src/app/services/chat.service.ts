import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getChatLog(): Observable<any> {
    return this.http.get(`${this.baseUrl}/chatlog`);
  }

  sendMessage(from: string, to: string, message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat`, { from, to, message });
  }
}
