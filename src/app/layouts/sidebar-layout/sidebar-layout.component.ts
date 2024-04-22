import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-sidebar-layout',
    templateUrl: './sidebar-layout.component.html',
    styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent {

    storedRole: string = '';
    storedEmail: string = '';
    storeUsername: string = '';
    storeIsFinance!: boolean;
    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.storedRole = localStorage.getItem('userRole') ?? '';
        this.storedEmail = localStorage.getItem('userEmail') ?? '';
        this.storeUsername = localStorage.getItem('userName') ?? '';
        const isFinanceValue = localStorage.getItem('IsFinance');
        this.storeIsFinance = isFinanceValue === 'true'; // Convert string to boolean


        $(".left-mobile-menu").click(function () {
            $(".menu-list").toggle();
        });

    }

    logout(): void {
        this.authService.logout();
    }

    get isAdmin() {
        return this.storedRole == 'Admin';
    }

    get isApprover() {
        return this.storedRole == 'Approver';
    }

    get isEmployee() {
        return this.storedRole == 'Employee';
    }

    get isAccount() {
        return this.storedRole == 'Accounts';
    }

    get isFinance() {
        return this.storeIsFinance == true;
    }

}
