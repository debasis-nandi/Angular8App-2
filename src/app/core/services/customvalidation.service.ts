import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class CustomValidationService {

    patternValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return null;
            }
            const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
            const valid = regex.test(control.value);
            return valid ? null : { invalidPassword: true };
        };
    }

    MatchPassword(password: string, confirmPassword: string) {
        return (formGroup: FormGroup) => {
            const passwordControl = formGroup.controls[password];
            const confirmPasswordControl = formGroup.controls[confirmPassword];

            if (!passwordControl || !confirmPasswordControl) {
                return null;
            }

            if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
                return null;
            }

            if (passwordControl.value !== confirmPasswordControl.value) {
                confirmPasswordControl.setErrors({ passwordMismatch: true });
            } else {
                confirmPasswordControl.setErrors(null);
            }
        }
    }

    userNameValidator(userControl: AbstractControl) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (this.validateUserName(userControl.value)) {
                    resolve({ userNameNotAvailable: true });
                } else {
                    resolve(null);
                }
            }, 1000);
        });
    }

    validateUserName(userName: string) {
        const UserList = ['admin', 'user', 'superuser'];
        return (UserList.indexOf(userName) > -1);
    }

    emailDomainValidator(control: AbstractControl) {
        let domainList = ['evalueserve.com'];
        let email = control.value;
        if (email && email.indexOf("@") != -1) {
            let [_, domain] = email.split("@");
            if (domain) {
                let isExist: boolean = (domainList.indexOf(domain) > -1);
                if (!isExist) {
                    return {
                        emailDomain: {
                            parsedDomain: domain
                        }
                    }
                }
            }
        }
        return null;
    }

}  