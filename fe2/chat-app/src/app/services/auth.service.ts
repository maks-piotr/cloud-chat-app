// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: 'YOUR_USER_POOL_ID',  // Replace with your AWS Cognito User Pool ID
      ClientId: 'YOUR_CLIENT_ID'        // Replace with your AWS Cognito App Client ID
    });
  }

  // Register a new user
  register(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, [], [], (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  // Authenticate an existing user
  login(username: string, password: string): Promise<string> {
    const user = new CognitoUser({ Username: username, Pool: this.userPool });
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });

    return new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
        onFailure: (err) => reject(err)
      });
    });
  }

  // Sign out the current user
  logout() {
    const user = this.userPool.getCurrentUser();
    if (user) user.signOut();
  }
  // src/app/services/auth.service.ts
// Add this method to AuthService
 // This method returns a Promise that resolves to the JWT token or null if not available
 getToken(): Promise<string | null> {
  const currentUser = this.userPool.getCurrentUser();

  return new Promise((resolve, reject) => {
    if (currentUser) {
      currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          resolve(null);
        } else {
          resolve(session.getIdToken().getJwtToken());
        }
      });
    } else {
      resolve(null);
    }
  });
}

}

