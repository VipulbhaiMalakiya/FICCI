import { AbstractControl, ValidatorFn } from '@angular/forms';

export function gstValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{2}$/;
    const gstNumber = control.value;

    if (!gstNumber || !gstRegex.test(gstNumber)) {
      return { 'invalidGST': true };
    }

    return null;
  };
}
