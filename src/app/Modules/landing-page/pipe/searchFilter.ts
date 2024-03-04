import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            return item.customerName.toLowerCase().includes(searchText) ||
             item.cityList.cityName.toLowerCase().includes(searchText)
             || item.address.toLowerCase().includes(searchText)
             || item.phoneNumber.toLowerCase().includes(searchText)
             || item.gstNumber.toLowerCase().includes(searchText)
             || item.pan.toLowerCase().includes(searchText)
             || item.createdOn.toLowerCase().includes(searchText)
             || item.createdBy.toLowerCase().includes(searchText)
             || item.customerStatus.toLowerCase().includes(searchText)
             ;
        });
    }
}
