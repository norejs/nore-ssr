import { Link } from 'react-router-dom';

export default function NewsList({ list = [], loading = false, error } = {}) {
    // 新闻列表
    return (
        <ul>
            {loading && <div>loading...</div>}
            {error && <div>{error}</div>}
            {(list ?? []).map((item) => {
                return (
                    <li key={item.id}>
                        <Link to={`/detail/${item.id}`}>
                            {item.title}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
