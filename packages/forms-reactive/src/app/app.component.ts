import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  genders = ["male", "female", "other"];
  signupForm: FormGroup;
  forbiddenUsernames = ["Chris", "Anna"];

  get hobbyControls() {
    return (this.signupForm.get("hobbies") as FormArray).controls;
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenNames.bind(this),
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          this.forbiddenEmails.bind(this),
        ),
      }),
      gender: new FormControl("male"),
      hobbies: new FormArray([]),
    });
    // this.signupForm.valueChanges.subscribe((value) => {
    //   console.log(value);
    // });
    this.signupForm.statusChanges.subscribe((status) => {
      console.log(status);
    });
    // this.signupForm.setValue({
    //   userData: {
    //     username: "Max",
    //     email: "max@test.com",
    //   },
    //   gender: "male",
    //   hobbies: [],
    // });
    this.signupForm.patchValue({
      userData: {
        username: "Anna",
      },
    });
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (this.signupForm.get("hobbies") as FormArray).push(control);
  }

  forbiddenNames(control: FormControl) {
    return this.forbiddenUsernames.indexOf(control.value) !== -1
      ? { nameIsForbidden: true }
      : null;
  }

  forbiddenEmails(control: FormControl) {
    return new Promise<{ emailIsForbidden: boolean }>((resolve, _) => {
      setTimeout(() => {
        resolve(
          control.value === "test@test.com" ? { emailIsForbidden: true } : null,
        );
      }, 1500);
    });
  }
}
