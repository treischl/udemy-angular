import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService, SignupResponseData } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const { email, password } = form.value;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.authService
        .login(email, password)
        .subscribe(...this.handleNextAuthResponse());
    } else {
      this.authService
        .signup(email, password)
        .subscribe(...this.handleNextAuthResponse());
    }

    form.reset();
  }

  private handleNextAuthResponse<TRespData extends SignupResponseData>() {
    return [
      (respData: TRespData) => {
        console.log(respData);
        this.isLoading = false;
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      },
    ];
  }
}
