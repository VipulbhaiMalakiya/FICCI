import { Component } from '@angular/core';
import { publicVariable } from '../../Export/invoce';

@Component({
  selector: 'app-accounts-inbox',
  templateUrl: './accounts-inbox.component.html',
  styleUrls: ['./accounts-inbox.component.css']
})
export class AccountsInboxComponent {
    publicVariable = new publicVariable();

}
