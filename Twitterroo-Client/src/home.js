import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'home'], name: 'dashboard', moduleId: 'viewmodels/dashboard/dashboard', nav: true, title: 'Dashboard' },
      { route: 'tweet', name: 'tweet', moduleId: 'viewmodels/tweet/tweet', nav: true, title: 'Tweet' },
      { route: 'friendsTimeline', name: 'friendsTimeline', moduleId: 'viewmodels/friendsTimeline/friendsTimeline', nav: true, title: 'Friends Timeline' },
      { route: 'globalTimeline', name: 'globalTimeline', moduleId: 'viewmodels/globalTimeline/globalTimeline', nav: true, title: 'Global Timeline' },
      { route: 'userlist', name: 'userlist', moduleId: 'viewmodels/userlist/userlist', nav: true, title: 'Userlist' },
      { route: 'settings', name: 'settings', moduleId: 'viewmodels/settings/settings', nav: true, title: 'Settings' },
      { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }
    ]);
    this.router = router;

    config.mapUnknownRoutes(instruction => {
      return 'home';
    });
  }
}
