import { promisify } from 'util';

import { parseString } from 'xml2js';

interface errorXML {
    OpenAPI_ServiceResponse: {
        cmmMsgHeader: [
            {
                errMsg: string[];
                returnAuthMsg: string[];
                returnReasonCode: string[];
            },
        ];
    };
}

const parseXML = promisify(parseString);
export async function parseErrorCode(error: string): Promise<string> {
    const errorXML: errorXML = (await parseXML(error)) as errorXML;
    const errorMsg = errorXML.OpenAPI_ServiceResponse.cmmMsgHeader[0].returnAuthMsg[0];
    console.log(errorMsg);
    return errorMsg;
}

export function isXML(str: string): boolean {
    const trimmed = str.trim();
    return trimmed.startsWith('<') && trimmed.endsWith('>');
}
