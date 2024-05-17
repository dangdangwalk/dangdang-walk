export const dataURLtoFile = (dataurl: string, fileName: string): File | null => {
    // 데이터 URL 문자열 분리
    const arr = dataurl.split(',');

    if (!arr || !arr[0] || !arr[1]) {
        console.error('Invalid data URL format');
        return null; // 또는 다른 에러 처리 로직
    }

    // MIME 타입 추출
    const mime = arr[0].match(/:(.*?);/)![1];
    // Base64 디코딩 전에 arr[1]이 undefined인지 확인
    if (!arr[1]) {
        console.error('Base64 data is missing');
        return null; // 또는 다른 에러 처리 로직
    }
    // Base64 디코딩
    let bstr = atob(arr[1]);
    const n = bstr.length;
    // Uint8Array 생성 및 채우기
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    // File 객체 반환
    return new File([u8arr.buffer], fileName, { type: mime });
};
