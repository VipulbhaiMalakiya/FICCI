import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-approval-remarks',
  templateUrl: './approval-remarks.component.html',
  styleUrls: ['./approval-remarks.component.css']
})
export class ApprovalRemarksComponent {
    customerId?: number;
    data: any;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.customerId = +params['id'];
        });
        this.data = history.state.data;
        console.log(this.data);

    }

}
