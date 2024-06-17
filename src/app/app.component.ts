import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'FICCI';


    constructor(private router: Router, private bnIdle: BnNgIdleService, private authService: AuthService) {

    }
    // @HostListener('window:beforeunload', ['$event'])
    // unloadHandler(event: Event) {
    //     const isPageRefreshOrInternalNavigation = event instanceof BeforeUnloadEvent;
    //     const isLoggedIn = !!localStorage.getItem('userEmail');
    //     const isTabClose = !isPageRefreshOrInternalNavigation;
    //     if (!isLoggedIn || isTabClose) {
    //         this.authService.logout();
    //     }
    // }


    ngOnInit(): void {


        if (localStorage.getItem('userEmail')) {
            this.router.navigate(['/']);
        }
        //900 =  15 minutes in seconds
        this.bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
            if (isTimedOut) {
                this.authService.logout();
            }
        });

    }
    ngOnDestroy(): void {
        this.authService.logout();
    }
}
