import React from 'react';

const WebView = () => {
    const sendMessageToWebView = () => {
        const messageData = { key: 'value' }; // 보낼 데이터
        window.postMessage(JSON.stringify(messageData), '*'); // '*'는 모든 출처를 의미
    };

    return (
        <button className="w-auto bg-slate-400 duration-150 active:bg-red-400" onClick={sendMessageToWebView}>
            WebView 통신
        </button>
    );
};

export default WebView;
