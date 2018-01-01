import {inject} from 'aurelia-framework';
import TwitterService from '../../services/twitterservice';

@inject(TwitterService)
export class Login {

  email = 'marge@simpson.com';
  password = 'secret';

  constructor(ts) {
    this.twitterService = ts;
    this.prompt = '';
  }

  login(e) {
    console.log(`Trying to log in ${this.email}`);
    this.twitterService.login(this.email, this.password);
  }
}
