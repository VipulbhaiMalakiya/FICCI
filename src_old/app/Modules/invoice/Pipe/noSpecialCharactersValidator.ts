// import { AbstractControl, ValidatorFn } from '@angular/forms';

// export function noSpecialCharactersValidator(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const value = control.value;
//     const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

//     if (specialCharsRegex.test(value)) {
//       return { 'specialCharactersNotAllowed': true };
//     }

//     return null;
//   };
// }
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noSpecialCharactersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    // Regular expression to allow only alphanumeric characters and spaces
    const allowedCharsRegex = /^[a-zA-Z0-9\s]*$/;

    if (!allowedCharsRegex.test(value)) {
      return { 'specialCharactersNotAllowed': true };
    }

    return null;
  };
}
