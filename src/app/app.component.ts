import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'FICCI';

    constructor(private router: Router, private bnIdle: BnNgIdleService, private authService: AuthService) {

    }

    ngOnInit(): void {
        if (sessionStorage.getItem('userEmail')) {
            this.router.navigate(['/']);
        }
        this.bnIdle.startWatching(60).subscribe((isTimedOut: boolean) => {
            if (isTimedOut) {
                this.authService.logout();
            }
        });

    }
}
