import { AbstractControl, ValidatorFn } from '@angular/forms';

export function alphanumericWithSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value?.trim(); // Trim leading and trailing spaces
        const valid = /^[a-zA-Z0-9,-_& ]+(?:\s[a-zA-Z0-9,-_& ]+)*$/.test(value);
        return valid ? null : { 'alphanumericWithSpaces': true };
    };
}
