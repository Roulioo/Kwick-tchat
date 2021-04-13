import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/services/notifierService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

  public errorMessage: string;
  public signUpForm: FormGroup;

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
   * Initialize form
   */
  private initForm() {
    this.signUpForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  /**
   * Submit form
   */
  public submitForm() {
    const user_name = this.signUpForm.get('user_name').value;
    const password = this.signUpForm.get('password').value;

    // api request user signUp
    this.authService.signUp(user_name, password).subscribe(
      (res) => {
        if (res.result.status === 'done') { // success
          this.notifierService.showSuccess(res.result.message, 'Notification');
          this.router.navigate(['/home']);
        } else { // error
          this.notifierService.showError(res.result.message, 'Notification');
        }
      }
    );
  }

}
