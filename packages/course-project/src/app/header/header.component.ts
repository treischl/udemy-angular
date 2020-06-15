import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from "../store/app.reducer";
import { map } from "rxjs/operators";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select("auth")
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = Boolean(user);
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.recipeService.saveRecipes();
  }

  onFetchData() {
    this.recipeService.loadRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
