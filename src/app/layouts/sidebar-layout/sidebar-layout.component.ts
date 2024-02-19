import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent {
    userEmail!: string;
  userRole!: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();
  }

  logout(): void {
    this.authService.logout();
  }
}
