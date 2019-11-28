const APP_DOMAIN_PROTOCOL = process.env.IDC_API_DOMAIN_PROTOCOL || 'http';
const APP_DOMAIN_HOST = process.env.IDC_API_DOMAIN_HOST || ""REPLACE"";
const APP_DOMAIN_PORT = process.env.IDC_API_DOMAIN_PORT || 8000;
const APP_DOMAIN_ENDPOINT = `${APP_DOMAIN_PROTOCOL}://${APP_DOMAIN_HOST}:${APP_DOMAIN_PORT}`;

export const apiBaseUrl = APP_DOMAIN_ENDPOINT + "/api/";
export const mongoDBBaseUrl = (process.env.DIMS_DEMO_MONGO_URL || "http://"REPLACE":8011") + '/';
