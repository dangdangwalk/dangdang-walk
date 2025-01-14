import * as http from 'http';

import { XMLParseError } from './public-weather-error';
import { isXML, parseErrorCode } from './xml-util';

export class HttpClient {
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async fetchData(): Promise<any> {
        return new Promise((resolve, reject) => {
            http.get(this.url, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', async () => {
                    if (res.statusCode === 200) {
                        try {
                            if (isXML(data)) {
                                throw new XMLParseError(await parseErrorCode(data));
                            }
                            resolve(JSON.parse(data));
                        } catch (error) {
                            if (error instanceof XMLParseError) {
                                reject(error.message);
                            } else {
                                reject('Failed to parse API response');
                            }
                        }
                    } else {
                        reject(`API request failed with status code : ${res.statusCode}`);
                    }
                });
            }).on('error', (error) => {
                reject(`API request failed: ${error.message}`);
            });
        });
    }
}

export function getHttpClientInstance(url: string): HttpClient {
    return new HttpClient(url);
}
