import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent {

    storedRole: string = '';
    storedEmail:string = '';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.storedRole = localStorage.getItem('userRole') ?? '';
    this.storedEmail = localStorage.getItem('userEmail') ?? '';
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
    return this.storedRole == 'Account';
  }

}
