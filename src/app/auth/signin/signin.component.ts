import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/services/notifierService';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {

  public errorMessage: string;
  public signInForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notifierService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();

    // redirect to home page when user is connected
    if (this.authService.isAuth) { this.router.navigate(['home']) }
  }

  /**
   * Init form
   */
  private initForm() {
    this.signInForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  /**
   * Submit form
   */
  public submitForm() {
    // fields of form
    const user_name = this.signInForm.get('user_name').value;
    const password = this.signInForm.get('password').value;

    // api request user signIn
    this.authService.signIn(user_name, password).subscribe(
      (res) => { // success
        if (res.result.status === 'done') {
          // localStorage
          res.result['isAuth'] = true;
          localStorage.setItem('currentUser', JSON.stringify(res.result))

          // notification
          this.notifierService.showSuccess(res.result.message, 'Notification');

          // connection done
          this.authService.isAuth = true;

          // redirect to home page + reloading
          this.router.navigate(['/home']);
          localStorage.setItem('firstLoadingPage', JSON.stringify(true));

        } else { // error
          this.notifierService.showError(res.result.message, 'Notification');
        }
      }
    );
  }

}
