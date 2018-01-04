import {inject} from 'aurelia-framework';
import TwitterService from '../../services/twitterservice';
import Home from '../../home';

@inject(TwitterService, Home)
export class Userlist {
  users1 = [];
  users2 = [];

  constructor(ts, h) {
    this.twitterService = ts;
    this.h = h;
    let userCount = ts.users.length;
    console.log('usercount ' + userCount);
    this.users1 = ts.users.slice(0, userCount / 2);
    this.users2 = ts.users.slice(userCount / 2);
  }

  test(e) {
    console.log('test called' + e);
    this.h.router.navigateToRoute('dashboard');
  }
}
