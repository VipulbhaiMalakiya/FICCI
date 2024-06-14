import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService, NgbModal, Router, ToastrService, UserService, publicVariable } from '../users/import';
import { finalize, timeout } from 'rxjs';

@Component({
    selector: 'app-data-sync',
    templateUrl: './data-sync.component.html',
    styleUrls: ['./data-sync.component.css']
})
export class DataSyncComponent implements OnInit, OnDestroy {
    publicVariable = new publicVariable();

    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private API: UserService,
        private toastr: ToastrService,

    ) {

    }
    ngOnInit(): void {
        this.publicVariable.isProcess = false;
    }

    ngOnDestroy() {
        if (this.publicVariable.Subscription) {
            this.publicVariable.Subscription.unsubscribe();
        }
    }

    syncCountry(): void {
        this.publicVariable.isProcess = true;
        const subscription = this.API.syncCountry()
            .pipe(finalize(() => { this.publicVariable.isProcess = false; }))
            .subscribe({
                next: (response: any) => {
                    if (response.status) {
                        this.toastr.success(response.message);
                    }
                    this.publicVariable.isProcess = false;
                },
                error: (error: any) => {
                    this.toastr.error(error.name === 'TimeoutError' ? 'Operation timed out after 40 seconds' : 'Error loading user list', error.name);
                }
            });

        this.publicVariable.Subscription.add(subscription);
    }

    syncState(): void {
        this.publicVariable.isProcess = true;
        const subscription = this.API.syncState()
            .pipe(finalize(() => { this.publicVariable.isProcess = false; }))
            .subscribe({
                next: (response: any) => {
                    if (response.status) {
                        this.toastr.success(response.message);
                    }
                    this.publicVariable.isProcess = false;
                },
                error: (error: any) => {
                    this.toastr.error(error.name === 'TimeoutError' ? 'Operation timed out after 40 seconds' : 'Error loading user list', error.name);
                }
            });

        this.publicVariable.Subscription.add(subscription);
    }

    syncCity(): void {
        this.publicVariable.isProcess = true;
        const subscription = this.API.syncCity()
            .pipe(finalize(() => { this.publicVariable.isProcess = false; }))
            .subscribe({
                next: (response: any) => {
                    if (response.status) {
                        this.toastr.success(response.message);
                    }
                    this.publicVariable.isProcess = false;
                },
                error: (error: any) => {
                    this.toastr.error(error.name === 'TimeoutError' ? 'Operation timed out after 40 seconds' : 'Error loading user list', error.name);
                }
            });

        this.publicVariable.Subscription.add(subscription);
    }
}
