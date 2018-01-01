import {inject} from 'aurelia-framework';
import Fixtures from './fixtures';
import {LoginStatus} from './messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';

@inject(Fixtures, EventAggregator, AsyncHttpClient)
export default class TwitterService {

  tweets = [];
  users = [];

  constructor(data, ea, ac) {
    this.ea = ea;
    this.ac = ac;
    this.getTweets();
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
