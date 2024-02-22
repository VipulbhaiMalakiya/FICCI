import { Component } from '@angular/core';
import { ActivatedRoute } from '../../Export/invoce';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-invoice-status',
  templateUrl: './view-invoice-status.component.html',
  styleUrls: ['./view-invoice-status.component.css']
})
export class ViewInvoiceStatusComponent {
    headerId?: number;
    data: any;
    FilePath:any;
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.headerId = +params['id'];
        });
        this.data = history.state.data;
        this.FilePath = `${environment.fileURL}${ this.data.headerAttachmentpath}`
    }

}
