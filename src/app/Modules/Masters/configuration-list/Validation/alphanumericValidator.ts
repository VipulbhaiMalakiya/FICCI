import { AbstractControl, ValidatorFn } from '@angular/forms';

export function alphanumericValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^[a-zA-Z0-9]*$/.test(control.value);
    return valid ? null : { 'alphanumeric': true };
  };
}


