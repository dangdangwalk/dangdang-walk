import * as http from 'http';

import 'dotenv/config';

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

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (error) {
                            reject('Failed to parte API response');
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
