import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

interface IValidation {
  [key: string]: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppValidators {
  constructor() {}

  public static matchingPasswordValidator(group: FormGroup): IValidation {
    return group.value.password === group.value.confirmPassword
      ? null
      : { unmatched: true };
  }
}
