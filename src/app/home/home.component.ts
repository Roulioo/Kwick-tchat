import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit() {
    //  after signIn reload home page
    if (JSON.parse(localStorage.getItem('firstLoadingPage'))) {
      location.reload();
      localStorage.setItem('firstLoadingPage', JSON.stringify(false));
    };
  }

}
