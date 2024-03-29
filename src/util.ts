
export const processCallback = <T>(status: string, response: T): Promise<T> => new Promise(async (rs, rj) => {
    if (status == 'complete') {
        rs(response);
    } else {
        rj((response as any)?.info || '未知错误')
    }
})