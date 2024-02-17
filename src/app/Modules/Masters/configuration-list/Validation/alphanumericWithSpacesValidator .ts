import { AbstractControl, ValidatorFn } from '@angular/forms';

export function alphanumericWithSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const valid = /^[a-zA-Z0-9\s]*$/.test(control.value);
        return valid ? null : { 'alphanumericWithSpaces': true };
    };
}
