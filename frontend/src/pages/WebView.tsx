import React from 'react';

const WebView = () => {
    const sendMessageToWebView = () => {
        const messageData = { key: 'value' };
        window.postMessage(JSON.stringify(messageData));
    };

    return (
        <button className="w-auto bg-slate-400 duration-150 active:bg-red-400" onClick={sendMessageToWebView}>
            WebView 통신
        </button>
    );
};

export default WebView;
