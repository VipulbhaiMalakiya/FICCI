import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, CustomersService, publicVariable } from '../../Export/new-customer';

@Component({
    selector: 'app-customer-status',
    templateUrl: './customer-status.component.html',
    styleUrls: ['./customer-status.component.css']
})
export class CustomerStatusComponent implements OnInit {
    customerId?: number;
    data: any;
    publicVariable = new publicVariable();


    constructor(private route: ActivatedRoute,      private API: CustomersService) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.customerId = +params['id'];
        });
        this.data = history.state.data;

        this.loadCityList();
    }

    loadCityList() {
        try {
            const subscription = this.API.getCityList().subscribe({
                next: (response: any) => {
                    this.publicVariable.cityList = response.data;
                    this.publicVariable.isProcess = false;
                },
                error: (error) => {
                    console.error('Error loading city list:', error);
                    console.error('Failed to load city list. Please try again later.');
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading city list:', error);
            console.error('An unexpected error occurred. Please try again later.');
        }
    }
    getCityName(cityId: string): string | undefined {
        const city = this.publicVariable.cityList.find((c: any) => c.cityId === cityId);
        const cityName = city ? city.cityName : undefined;
        return cityName;
    }



}
