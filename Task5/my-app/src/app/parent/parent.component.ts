import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  imports: [],
  templateUrl: './parent.component.html',
})
export class ParentComponent {
  message: string = "Hello from Parent Component!";

  student = {
    name: "Ali",
    rollNo: 101,
  };
}
