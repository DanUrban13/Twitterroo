import {inject} from 'aurelia-framework';
import Fixtures from './fixtures';
import {LoginStatus} from './messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';

@inject(Fixtures, EventAggregator, AsyncHttpClient)
export default class TwitterService {

  tweets = [];
  users = [];
  currentUser = {
    id: '',
    email: 'marge@simpson.com'
  }

  constructor(data, ea, ac) {
    this.ea = ea;
    this.ac = ac;
    this.getTweets();
    this.getUsers();
  }

  getTweets() {
    this.ac.get('/api/tweets').then(res => {
      this.tweets = res.content;
    });
  }

  getUsers() {
    this.ac.get('/api/users').then(res => {
      this.users = res.content;
    });
  }

  tweet(text) {
    // const donation = {
    //   amount: amount,
    //   method: method
    // };
    // this.ac.post('/api/candidates/' + candidate._id + '/donations', donation).then(res => {
    //   const returnedDonation = res.content;
    //   this.donations.push(returnedDonation);
    //   console.log(amount + ' donated to ' + candidate.firstName + ' ' + candidate.lastName + ': ' + method);
    //
    //   this.total = this.total + parseInt(amount, 10);
    //   console.log('Total so far ' + this.total);
    //   this.ea.publish(new TotalUpdate(this.total));
    // });
  }

  // addCandidate(firstName, lastName, office) {
  //   const candidate = {
  //     firstName: firstName,
  //     lastName: lastName,
  //     office: office
  //   };
  //   this.ac.post('/api/candidates', candidate).then(res => {
  //     this.candidates.push(res.content);
  //   });
  // }

  getUserData() {
    for (let i = 0; i < this.users.length; i++){
      if (this.users[i].email === this.currentUser.email) {
        return this.users[i];
      }
    }
  }

  getMyTweets() {
    let tweets = [];
    for (let i = 0; i < this.tweets.length; i++) {
      //set currentUser id
      for (let s = 0; s < this.users.length; s++ ){
        if (this.currentUser.email === this.users[s].email) {
          this.currentUser.id = this.users[s]._id;
        }
      }

      if (this.currentUser.id === this.tweets[i].creator._id) {
        tweets.push(this.tweets[i]);
      }
    }
    return tweets;
  }

  getFriendsTweets() {
    let tweets = [];
    let user;
    for (let s = 0; s < this.users.length; s++ ){
      if (this.currentUser.email === this.users[s].email) {
        user = this.users[s];
      }
    }
    for (let j = 0; j < user.following.length; j++) {
      for (let i = 0; i < this.tweets.length; i++) {
        if (user.following[j]._id === this.tweets[i].creator._id) {
          tweets.push(this.tweets[i]);
        }
      }
    }
    return tweets;
  }

  settings(firstName, lastName, email, password) {
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    this.ac.put('/api/users', newUser).then(res => {
      this.getUsers();
    });
  }


  register(firstName, lastName, email, password) {
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    this.ac.post('/api/users', newUser).then(res => {
      this.getUsers();
    });
  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.ac.authenticate('/api/users/authenticate', user);
    this.currentUser = user;

  }

  logout() {
    const status = {
      success: false,
      message: ''
    };
    this.ac.clearAuthentication();
    this.ea.publish(new LoginStatus(status));
  }

  isAuthenticated() {
    return this.ac.isAuthenticated();
  }
}
