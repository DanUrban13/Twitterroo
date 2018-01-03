import {inject} from 'aurelia-framework';
import TwitterService from '../../services/twitterservice';

@inject(TwitterService)
export class Settings {

  firstName = '';
  lastName = '';
  email = '';
  password = '';

  constructor(ts) {
    this.twitterService = ts;
    let currentUser = this.twitterService.getUserData();
    this.firstName = currentUser.firstName;
    this.lastName = currentUser.lastName;
    this.email = currentUser.email;
    this.password = currentUser.password;
  }

  edit(e) {
    this.twitterService.settings(this.firstName, this.lastName, this.email, this.password);
  }
}
