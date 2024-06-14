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
            return item.c_Code.toLowerCase().includes(searchText)
            || item.category_Name.toLowerCase().includes(searchText)
            || item.c_Value.toLowerCase().includes(searchText)
            || (typeof item.isActive === 'boolean' && item.isActive === (searchText === 'yes'));
        });
    }
}
