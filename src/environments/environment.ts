// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  enableDebug: true,
  imaPath:'assets/images/',
  templatePath:'assets/template/',
  jsonFilePath:'assets/datasource/',
  isAdAuth: true,
  enableFinishCount:20,
  maxUploadFileSize: 1.5e+8, //1.5e+8 | 20480 // byte
  scopeUri:[''],
  tenantId: '0483ae51-a627-466e-a7dd-de2ac7e1238e',
  uiClienId: '0132b42a-abae-457b-987c-88ef3ad1f7be',
  authority:'https://login.microsoftonline.com/',

  baseUrl: '',
  baseUrlHealthCheck: '',
  baseUrlTidyUp: '',
  baseUrlMLConsolidation: '',
  baseUrlAIEnrich: '',
  redirectUrl: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
