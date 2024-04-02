import { Component } from '@angular/core';

@Component({
  selector: 'app-validation-popup',
  templateUrl: './validation-popup.component.html',
  styleUrls: ['./validation-popup.component.css']
})
export class ValidationPopupComponent {
    private _emailMaster: any | undefined;

    set isEmail(value: any) {
        this._emailMaster = value;
        console.log(this._emailMaster);
        
    }
}
