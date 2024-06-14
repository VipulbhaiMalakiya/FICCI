import { AbstractControl, ValidatorFn } from '@angular/forms';

export function panValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const panRegex = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/;
        if (!panRegex.test(control.value) && control.value != null && control.value!= undefined ) {
            return { 'invalidPAN': true };
        }
        return null;
    };
}


