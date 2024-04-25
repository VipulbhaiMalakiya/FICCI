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
            return item.imeM_EmpId.toLowerCase().includes(searchText)
            || item.imeM_Name.toLowerCase().includes(searchText)
            || item.imeM_Email.toLowerCase().includes(searchText)
            || item.imeM_Username.toLowerCase().includes(searchText)
            || item.roleName.toLowerCase().includes(searchText)
            || item.department.toLowerCase().includes(searchText)
            // || item.departmentName.toLowerCase().includes(searchText)
            || (typeof item.isActive === 'boolean' && item.isActive === (searchText === 'yes'));;
        });
    }
}
