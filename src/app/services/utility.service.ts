import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor() {}

  trackById(index: number, item: any): number {
    return item.id; // Assuming your item has a unique identifier property called 'id'
  }
}
