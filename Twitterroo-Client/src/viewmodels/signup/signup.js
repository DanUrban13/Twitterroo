import {inject} from 'aurelia-framework';
import TwitterService from '../../services/twitterservice';

@inject(TwitterService)
export class Signup {

  firstName = 'Marge';
  lastName = 'Simpson';
  email = 'marge@simpson.com';
  password = 'secret';

  constructor(ts) {
    this.twitterService = ts;
  }

  register(e) {
    this.showSignup = false;
    this.twitterService.register(this.firstName, this.lastName, this.email, this.password);
    this.twitterService.login(this.email, this.password);
  }
}
