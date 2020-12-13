import { ValidationError } from 'class-validator';

export function transform(errors: ValidationError[]): string[] {
  const validationDetails: string[] = [];
  for (const error of errors) {
    validationDetails.push(
      JSON.stringify(error.constraints)
        .replace(new RegExp('{'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), '')
        .replace(new RegExp('"'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), '')
        .replace(new RegExp('}'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), ''),
    );
  }
  return validationDetails;
}
