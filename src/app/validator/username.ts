import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const isValid = usernameRegex.test(control.value);

    return isValid ? null : { user: true };
  };
}
