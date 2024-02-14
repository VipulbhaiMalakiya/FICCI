import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-purchase-invoice',
  templateUrl: './new-purchase-invoice.component.html',
  styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit{
  items: any[] = [
    { name: '', unit: '', discount: '', rate: '', amount: 0 }
  ];
  totalAmount: number = 0;
  totalAmountInWords: string = '';

  ngOnInit(): void {
    this.calculateTotal();

  }
  calculateTotal(): void {
    this.totalAmount = this.items.reduce((total, item) => total + parseFloat(item.amount || '0'), 0);
  }

  addRow(): void {
    this.items.push({ name: '', unit: '', discount: '', rate: '', amount: 0 });
    this.calculateTotal(); // Recalculate total when adding a row
  }

  removeRow(index: number): void {
    this.items.splice(index, 1);
    this.calculateTotal(); // Recalculate total when removing a row
  }
  editRow(data:any):void{

  }

  submitRow(data:any){
    
  }
 
 
}
