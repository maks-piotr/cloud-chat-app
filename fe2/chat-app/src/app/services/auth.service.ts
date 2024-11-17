import { Injectable } from '@angular/core';
import { AuthUser, getCurrentUser, signOut, fetchAuthSession, AuthTokens } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: 'us-east-1_uqVYJ45ln',
          userPoolClientId: '7s8cbbjpdgdnv603nerg2nf5eg',
          signUpVerificationMethod: 'code',
              loginWith: {
                username: true
              }
          
        }
      }
    });
   }

  async getCurrentUser(): Promise<AuthUser> {
    return await getCurrentUser();
  }

  async getCurrentSession(): Promise<AuthTokens | undefined> {
    return (await fetchAuthSession()).tokens;
  }

  async getCurrentUserFullName(): Promise<string | undefined> {
    let cognitoToken = await (await fetchAuthSession()).tokens;
    return cognitoToken?.idToken?.payload['name']?.toString();
  }

  signOut() {
    signOut();
  }

}

