import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [10,20,50,100]; // You can adjust these values as needed
  searchText: string = '';

  users = [
    { id: 1,employeeId: 1, userName: 'user1', name: 'John Doe', role: 'Employee', email: 'john@example.com', active: 'Yes' },
  ];
  ngOnInit(): void {
    this.addDummyRecords();
  }
  addDummyRecords() {
    for (let i = 2; i <= 21; i++) {
      this.users.push({
        id: i,
        employeeId: i,
        userName: 'user' + i,
        name: 'Dummy User ' + (i - 1),
        role: 'Employee',
        email: 'user' + i + '@example.com',
        active: Math.random() < 0.5 ? 'Yes' : 'No'
      });
    }
  }

}
