import { Component } from '@angular/core';
import { ActivatedRoute, CustomersService, publicVariable } from '../../Export/invoce';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-invoice-status',
  templateUrl: './view-invoice-status.component.html',
  styleUrls: ['./view-invoice-status.component.css']
})
export class ViewInvoiceStatusComponent {
    headerId?: number;
    data: any;
    FilePath:any;
    publicVariable = new publicVariable();

    constructor(private route: ActivatedRoute,private CAPI: CustomersService,) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.headerId = +params['id'];
        });
        this.data = history.state.data;
        console.log(this.data);


        this.FilePath = `${environment.fileURL}${ this.data.impiHeaderAttachment}`;
        this.loadStateList();
    }

    loadStateList() {
        try {
            const subscription = this.CAPI.getStateList().subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
                    this.handleLoadingError()
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError()
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError()
        }
    }


    getStateNameById(stateId:string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
    }


    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

}
