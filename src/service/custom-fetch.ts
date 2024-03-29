const baseUrl = "https://sg-mock-api.lalamove.com"
const MAX_RETRY_TIMES = 30;

export const CustomFetch = ({
    path, method, payload, headers
}: {
    path: string,
    method: "post" | "get",
    payload?: Record<string, string>,
    headers?: Record<string, string>,
    retryTimes?: number
}) => {
    return new Promise((rs, rj) => {
        let tryCount = 1;
        const runFetch = () => {
            const isPost = method === "post";
            const urlParams = (isPost && payload) ? "" : `?${new URLSearchParams(payload).toString()}`
            const url = `${baseUrl}${path}${urlParams}`
            fetch(url, {
                method,
                body: isPost ? JSON.stringify(payload) : undefined,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    ...headers
                }
            })
                .then(async res => {
                    if (res.status !== 200) {
                        throw Error(await res.text())
                    }
                    return res.json();
                })
                .then((resp) => {
                    // 如果返回体status为in progress 则重试直到成功,最多n次
                    if (resp?.status === 'in progress') {
                        if (tryCount < MAX_RETRY_TIMES) {
                            tryCount++;
                            runFetch();
                        } else {
                            throw Error(`${url}请求次数已超出${MAX_RETRY_TIMES}次，已终止：${resp.error || resp.status}`)
                        }
                    } else if (resp?.status === 'failure') {
                        throw Error(resp.error)
                    } else {
                        rs(resp)
                    }
                })
                .catch((err) => {
                    console.error(err.message);
                    rj(err)
                })
        }
        runFetch();
    })
}