import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const session = await this.authService.getCurrentSession();
    const token = session?.accessToken;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  async getUsers(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/users`, { headers });
  }

  async getChatLog(loggedInUser: string, selectedUser: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/chatlog`, { loggedInUser, selectedUser }, { headers });
  }

  async sendMessage(from: string, to: string, message: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/chat`, { from, to, message }, { headers });
  }
}
