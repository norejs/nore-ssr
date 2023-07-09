import { Link } from 'react-router-dom';

export default function NewsList({ list = [], loading = false, error } = {}) {
    // 新闻列表
    return (
        <ul>
            {loading && <div>loading...</div>}
            {error && <div>{error}</div>}
            {(list ?? []).map((item) => {
                return (
                    <li key={item.uniquekey}>
                        <Link to={`/detail/${item.uniquekey}`}>
                            {item.title}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
