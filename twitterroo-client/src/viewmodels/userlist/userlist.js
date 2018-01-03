import {inject} from 'aurelia-framework';
import TwitterService from '../../services/twitterservice';

@inject(TwitterService)
export class Userlist {
  users1 = [];
  users2 = [];

  constructor(ts) {
    this.twitterService = ts;
    let userCount = ts.users.length;
    console.log('usercount ' + userCount);
    this.users1 = ts.users.slice(0, userCount / 2);
    this.users2 = ts.users.slice(userCount / 2);
  }
}
