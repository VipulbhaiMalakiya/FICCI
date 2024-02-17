import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../Export/new-customer';

@Component({
  selector: 'app-customer-status',
  templateUrl: './customer-status.component.html',
  styleUrls: ['./customer-status.component.css']
})
export class CustomerStatusComponent  implements OnInit{
  customerId?: number;
  data: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.customerId = +params['id'];
    });
    this.data = history.state.data;
  }
}
