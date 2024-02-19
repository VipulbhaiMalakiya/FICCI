import { AbstractControl, ValidatorFn } from '@angular/forms';

export function gstValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;
        const gstNumber = control.value;

        if (!gstNumber || !gstRegex.test(gstNumber)) {
            return { 'invalidGST': true };
        }

        return null;
    };
}
