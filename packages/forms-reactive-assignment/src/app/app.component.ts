import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  statuses = ["Stable", "Critical", "Finished"];
  projectForm: FormGroup;

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      projectName: new FormControl(
        null,
        Validators.required,
        this.forbiddenProjectNames,
      ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      projectStatus: new FormControl(null),
    });
  }

  forbiddenProjectNames(control: FormControl) {
    return new Promise<{ [key: string]: boolean }>((resolve) => {
      setTimeout(() => {
        resolve(control.value === "Test" ? { nameIsForbidden: true } : null);
      }, 1000);
    });
  }

  onSubmit() {
    console.log(this.projectForm);
  }
}
