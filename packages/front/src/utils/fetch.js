// 可取消的fetch
export default function cancelAbleFetch(url, options) {
    const controller = new AbortController();
    const { signal } = controller;
    const promise = fetch(url, {
        ...options,
        signal,
    });
    promise.cancel = () => controller.abort();
    return promise;
}
