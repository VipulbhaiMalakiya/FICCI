import { AbstractControl, ValidatorFn } from '@angular/forms';

export function alphanumericWithSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value?.trim(); // Trim leading and trailing spaces
        const valid = /^[a-zA-Z0-9_.,&-]+(?:\s[a-zA-Z0-9_.,&-]+)*$/.test(value);

        if (!valid && (value != null || value !='' )) {
            return { 'alphanumericWithSpaces': true };
        }
        
        return null;

        // return valid ? null : { 'alphanumericWithSpaces': true };



        // const gstRegex = new RegExp(`^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9][A-Z]{5}\\d{4}[A-Z]{1}\\d[Z]{1}[A-Z\\d]{1}$`);
        // const gstNumber = control.value;

        // if (!gstNumber || !gstRegex.test(gstNumber)) {
        //     return { 'invalidGST': true };
        // }



    };
}
