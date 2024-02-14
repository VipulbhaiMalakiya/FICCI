import { AbstractControl, ValidatorFn } from '@angular/forms';

export function panValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(control.value)) {
      return { 'invalidPAN': true };
    }
    return null;
  };
}


