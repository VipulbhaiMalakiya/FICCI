import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  dataForm: FormGroup;
  isedite: boolean = false; // Assuming patch data is initially not received

  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService

  ) {
    this.dataForm = this.fb.group({
      id: [''],
      employeeId: ['', Validators.required],
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      isActive: [false] // Assuming default value is true
    });
  }

  onSubmit(){

  }
}
