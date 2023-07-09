import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNewsDetail } from '../apis/news';
export default function Detail(props) {
    const params = useParams();
    const [detail, setDetail] = useState({});
    const id = params.id;
    useEffect(() => {
        const fetchInstance = fetch(id);
        return () => {
            try {
                fetchInstance.cancel();
            } catch (error) {}
        };
    }, [id]);

    const fetch = async (id) => {
        // fetch data
        const res = await getNewsDetail(id);
        const { result } = res;
        if (result) {
            setDetail(result);
        } else {
            setDetail({});
        }
    };
    const { title, content } = detail;
    return (
        <>
            <h1>{title}</h1>
            <p>{content}</p>
        </>
    );
}
