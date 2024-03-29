import { ValidatorFn, AbstractControl } from "@angular/forms";

export function gstValidator(gstStateCode: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        // Modify the regular expression to incorporate the state code
        const gstRegex = new RegExp(`^${gstStateCode}[A-Z]{5}\\d{4}[A-Z]{1}\\d[Z]{1}[A-Z\\d]{1}$`);
        const gstNumber = control.value;

        if (!gstNumber || !gstRegex.test(gstNumber)) {
            return { 'invalidGST': true };
        }

        return null;
    };
}