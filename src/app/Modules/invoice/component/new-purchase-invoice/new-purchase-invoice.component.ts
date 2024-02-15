import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-purchase-invoice',
  templateUrl: './new-purchase-invoice.component.html',
  styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {


  ngOnInit(): void {

  }

  //
  items: any[] = [
    { name: 'I phone 15 Pro Max', unit: '100', discount: '10', rate: '150000', amount: 0 }
  ];
  addRow(): void {
    this.items.push({ name: '', unit: '', discount: '', rate: '', amount: 0 });
  }
  removeRow(index: number): void {
    this.items.splice(index, 1);
  }
  calculateAmount(item: any): number {
    const unit = parseFloat(item.unit) || 0;
    const discount = parseFloat(item.discount) || 0;
    const rate = parseFloat(item.rate) || 0;
    const amount = unit * rate * (1 - discount / 100);
    return isNaN(amount) ? 0 : amount;
  }
  calculateTotalAmount(): number {
    let total = 0;
    for (let item of this.items) {
      total += this.calculateAmount(item);
    }
    return total;
  }
}
