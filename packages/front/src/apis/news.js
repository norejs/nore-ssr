import '../mock/list';
import cancelAbleFetch from '../utils/fetch';
const APIURL = '';
export function getNewsList() {
    return cancelAbleFetch(`/news/index`).then((res) => res.json());
}

export function getNewsDetail(id) {
    return cancelAbleFetch(`${APIURL}/news/content?id=${id}`).then(
        (res) => res.json()
    );
}
