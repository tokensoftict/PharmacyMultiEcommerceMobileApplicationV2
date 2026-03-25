import SentenceCase from "@/shared/utils/SentenceCase.tsx";

const ones: string[] = [
    '', 'First', 'Second', 'Third', 'Fourth', 'Fifth',
    'Sixth', 'Seventh', 'Eighth', 'Ninth'
];

const teens: string[] = [
    'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth',
    'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth'
];

const tens: string[] = [
    '', '', 'Twentieth', 'Thirtieth', 'Fortieth', 'Fiftieth',
    'Sixtieth', 'Seventieth', 'Eightieth', 'Ninetieth'
];

const tensPrefix: string[] = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'
];


export default function(n: number): string  {
    if (n <= 0 || n > 100) return `${n}th`;
    if (n <= 9) return ones[n];
    if (n >= 10 && n <= 19) return teens[n - 10];
    if (n % 10 === 0 && n < 100) return tens[n / 10];
    if (n < 100) {
        const ten = Math.floor(n / 10);
        const one = n % 10;
        return SentenceCase(`${tensPrefix[ten]}-${ones[one]}`.toUpperCase());
    }
    return SentenceCase('hundredth'.toUpperCase());
};

