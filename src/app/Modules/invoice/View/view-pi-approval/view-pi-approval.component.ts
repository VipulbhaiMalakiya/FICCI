import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-pi-approval',
  templateUrl: './view-pi-approval.component.html',
  styleUrls: ['./view-pi-approval.component.css']
})
export class ViewPiApprovalComponent {
    headerId?: number;
    data: any;
    FilePath:any;
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.headerId = +params['id'];
        });
        this.data = history.state.data;
        this.FilePath = `${environment.fileURL}${ this.data.impiHeaderAttachment}`;
        console.log( this.FilePath);

    }
}
