import {inject} from 'aurelia-framework';
import TwitterService from '../../services/twitterservice';

@inject(TwitterService)
export class Tweetlist {

  tweets = [];

  constructor(ts) {
    this.twitterService = ts;
    this.tweets = this.twitterService.tweets;
  }
}
