import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-conformation-model',
  templateUrl: './conformation-model.component.html',
  styleUrls: ['./conformation-model.component.css']
})
export class ConformationModelComponent implements OnInit {
    heading: string = '';
    message: string = '';
    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit(): void {

    }

    onCancel() {
        this.activeModal.close(false);
    }

    onConfirm() {
        this.activeModal.close(true);
    }
}