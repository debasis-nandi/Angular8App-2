import { Injectable, Injector } from '@angular/core';
import { Environment } from '../config/app-enum';
import { environment } from '../../../environments/environment';

export interface IEnviroment{
    baseUrl?: string;
    baseUrlHealthCheck?: string;
    baseUrlTidyUp?: string;
    baseUrlMLConsolidation?: string;
    baseUrlAIEnrich?: string;
    redirectUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class EnvService {
    private _env: Environment;
    private _envConfig:IEnviroment;

    get env(): Environment {
        return this._env;
    }

    get envConfig(): IEnviroment {
        return this._envConfig;
    }

    constructor() { }

    init(): Promise<void> {
        return new Promise(resolve => {
            this.setEnvVariables();
            resolve();
        });
    }

    private setEnvVariables(): void {
        const hostname = window && window.location && window.location.hostname;
        console.log(hostname);
        if (/^.*localhost.*/.test(hostname)) { // local
            environment.baseUrl = 'https://quesensedevauth.evalueserve.com',
            environment.baseUrlHealthCheck = 'https://quesensedevhealthcheck.evalueserve.com',
            environment.baseUrlTidyUp = 'https://quesensedevtidy.evalueserve.com',
            environment.baseUrlMLConsolidation = 'https://quesensedevml.evalueserve.com',
            environment.baseUrlAIEnrich = 'https://quesensedevai.evalueserve.com',
            environment.redirectUrl = 'http://localhost:4200'
        } else if (/^quesensedev.evalueserve.com/.test(hostname)) { //dev | uat
            environment.baseUrl = 'https://quesensedevauth.evalueserve.com',
            environment.baseUrlHealthCheck = 'https://quesensedevhealthcheck.evalueserve.com',
            environment.baseUrlTidyUp = 'https://quesensedevtidy.evalueserve.com',
            environment.baseUrlMLConsolidation = 'https://quesensedevml.evalueserve.com',
            environment.baseUrlAIEnrich = 'https://quesensedevai.evalueserve.com',
            environment.redirectUrl = 'https://quesensedev.evalueserve.com'
        } else if (/^quesensetest.evalueserve.com/.test(hostname)) { // stage
            environment.baseUrl = 'https://quesensetestauth.evalueserve.com',
            environment.baseUrlHealthCheck = 'https://quesensetesthealthcheck.evalueserve.com',
            environment.baseUrlTidyUp = 'https://quesensetesttidy.evalueserve.com',
            environment.baseUrlMLConsolidation = 'https://quesensetestml.evalueserve.com',
            environment.baseUrlAIEnrich = 'https://quesensetestai.evalueserve.com',
            environment.redirectUrl = 'https://quesensetest.evalueserve.com'
        } else if (/^quesense.evalueserve.com/.test(hostname)) { //prod
            environment.baseUrl = 'https://quesenseauth.evalueserve.com',
            environment.baseUrlHealthCheck = 'https://quesensehealthcheck.evalueserve.com',
            environment.baseUrlTidyUp = 'https://quesensetidy.evalueserve.com',
            environment.baseUrlMLConsolidation = 'https://quesenseml.evalueserve.com',
            environment.baseUrlAIEnrich = 'https://quesenseai.evalueserve.com',
            environment.redirectUrl = 'https://quesense.evalueserve.com'
        } else {
            console.warn(`Cannot find environment for host name ${hostname}`);
        }
    }
}