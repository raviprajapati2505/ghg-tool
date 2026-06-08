import * as ExcelJS from 'exceljs';

export interface ParsedExcelData {
    data: any[];
    errors: string[];
}

export const parseExcelFile = async (
    file: File,
    expectedFields: string[],
    columnMapping?: Record<string, string> // Make it optional
): Promise<ParsedExcelData> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(arrayBuffer, {
                    ignoreNodes: [
                        'dataValidations',
                        'sheetViews',
                        'mergeCells',
                        'conditionalFormatting',
                        'extLst'
                    ]
                });
                const worksheet = workbook.worksheets[0];

                if (!worksheet) {
                    resolve({ data: [], errors: ['Excel file is empty'] });
                    return;
                }

                const jsonData: any[] = [];
                let headers: string[] = [];
                let normalizedHeaders: string[] = [];

                worksheet.eachRow((row, rowNumber) => {

                    if (rowNumber === 1) {
                        const rawValues = row.values as any[];
                        rawValues.shift();
                        headers = rawValues.map(h => String(h || '').trim());

                        normalizedHeaders = headers.map(h => {
                            if (!h) return '';

                            let normalized = h.toLowerCase().trim();
                            normalized = normalized.replace(/\s*\/\s*/g, '___');
                            normalized = normalized.replace(/\//g, '___');
                            normalized = normalized.replace(/\s*-\s*/g, '___');
                            normalized = normalized.replace(/\s+/g, '_');
                            normalized = normalized.replace(/\(/g, '');
                            normalized = normalized.replace(/\)/g, '');
                            normalized = normalized.replace(/%/g, '');
                            normalized = normalized.replace(/&/g, '');
                            normalized = normalized.replace(/-/g, '_');

                            return normalized;
                        });

                        // console.log('Raw headers:', headers);
                        // console.log('Normalized headers:', normalizedHeaders);
                        // console.log('Column mapping:', columnMapping);

                    } else {
                        const rowData: any = {};
                        const values = row.values as any[];
                        values.shift();
                        normalizedHeaders.forEach((normalizedHeader, index) => {
                            if (!normalizedHeader) return;

                            // If columnMapping exists, use it; otherwise use normalized header
                            const dbFieldName = columnMapping?.[normalizedHeader] || normalizedHeader;
                            const value = values[index];
                            // console.log(`Mapping to field "${dbFieldName}" with value:`, value);
                            if (dbFieldName === 'destinations' || normalizedHeader === 'destinations') {
                                const distinationsValueinArr = destinationsInToArr(value || '');
                                rowData[dbFieldName] = distinationsValueinArr;
                            } else {
                                rowData[dbFieldName] = value !== undefined && value !== null ? value : '';
                            }
                        });

                        if (Object.values(rowData).some(val => val !== '' && val !== null && val !== undefined)) {
                            jsonData.push(rowData);
                        }
                    }
                });

                // console.log('Parsed data:', jsonData);

                if (jsonData.length === 0) {
                    resolve({ data: [], errors: ['No data rows found in Excel'] });
                    return;
                }

                resolve({ data: jsonData, errors: [] });

            } catch (error) {
                console.error('Parse error details:', error);
                resolve({
                    data: [],
                    errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`]
                });
            }
        };

        reader.onerror = (error) => {
            console.error('FileReader error:', error);
            resolve({
                data: [],
                errors: ['Failed to read file']
            });
        };

        reader.readAsArrayBuffer(file);
    });
};

export const destinationsInToArr = (destinations: string | string[]): string[] => {
    if (Array.isArray(destinations)) {
        return destinations.filter(dest => dest.trim() !== '');
    } else if (destinations && typeof destinations === 'string' && destinations.trim() !== '') {
        // 1. Replace any character not a-z, A-Z, or / with /
        let cleanedDestinations = destinations.replace(" ", '');
        cleanedDestinations = cleanedDestinations.replace(/[^a-zA-Z/]+/g, '/');
        // 2. Replace multiple / with single /
        cleanedDestinations = cleanedDestinations.replace(/\/+/g, '/');

        // 3. Split and trim each entry
        const arr = cleanedDestinations ? cleanedDestinations
            .split('/')
            .map(dest => dest.trim())
            .filter(dest => dest !== '') : [];

        return arr;
    } else {
        return [];
    }
};