import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService, SignupResponseData } from "./auth.service";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder.directive";
import { Subscription } from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  ngOnDestroy() {
    this.closeSub?.unsubscribe();
  }

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
        this.router.navigate(["/recipes"]);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      },
    ];
  }

  private showErrorAlert(message: string) {
    this.alertHost.viewContainerRef.clear();
    const cmpRef = this.alertHost.viewContainerRef.createComponent(
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent),
    );
    cmpRef.instance.message = message;
    this.closeSub = cmpRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      this.alertHost.viewContainerRef.clear();
    });
  }
}
