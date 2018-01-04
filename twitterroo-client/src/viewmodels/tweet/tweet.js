import {inject} from 'aurelia-framework';
import TwitterService from '../../services/twitterservice';

@inject(TwitterService)
export class Tweet {

  text = '';

  constructor(ts) {
    this.twitterService = ts;
  }

  tweet(e){
    this.twitterService.tweet(this.text);
  }
}
