import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noSpecialCharactersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (specialCharsRegex.test(value)) {
      return { 'specialCharactersNotAllowed': true };
    }

    return null;
  };
}
