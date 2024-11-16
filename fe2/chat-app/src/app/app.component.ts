import { Component } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  title = 'chat-app';
  constructor() {
    
  }
}
