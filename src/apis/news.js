const APIKEY = '233995bfdc5a268b4834bd9dfb3b6e8c';
const APIURL = '/api';
export function getNewsList() {
    return fetch(`${APIURL}/toutiao/index?key=${APIKEY}`).then((res) =>
        res.json()
    );
}

export function getNewsDetail(id) {
    return fetch(
        `${APIURL}/toutiao/content?key=${APIKEY}&uniquekey=${id}`
    ).then((res) => res.json());
}
