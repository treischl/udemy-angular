import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder.directive";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>,
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select("auth").subscribe((authState) => {
      this.isLoading = authState.loading;
      if (Boolean(authState.authError)) {
        this.showErrorAlert(authState.authError);
      }
    });
  }

  ngOnDestroy() {
    this.closeSub?.unsubscribe();
    this.storeSub?.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const { email, password } = form.value;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));
    }

    form.reset();
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
