import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {
    transform(value: number): string {
        // Array of words for numbers from 0 to 19
        const units: string[] = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        // Array of words for tens
        const tens: string[] = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        // Array of words for thousands
        const thousands: string[] = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

        // Function to recursively convert numbers to words
        const convert = (n: number): string => {
            if (n < 20) {
                return units[n];
            } else if (n < 100) {
                return tens[Math.floor(n / 10)] + ' ' + units[n % 10];
            } else if (n < 1000) {
                return units[Math.floor(n / 100)] + ' Hundred ' + convert(n % 100);
            } else {
                for (let i = 0; i < thousands.length; i++) {
                    if (n < 1000 ** (i + 1)) {
                        return convert(Math.floor(n / (1000 ** i))) + ' ' + thousands[i] + ' ' + convert(n % (1000 ** i));
                    }
                }
            }
            return '';
        };

        // Call the recursive function to convert the number
        return convert(value);
    }
}
