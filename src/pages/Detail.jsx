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
    }, []);

    const fetch = async (id) => {
        // fetch data
        const res = await getNewsDetail(id);
        const { result } = res;
        if (result?.detail) {
            console.log(result.detail);
            setDetail(result.detail);
        } else {
            setDetail({});
        }
    };
    const { title, url } = detail;
    return (
        <>
            <h1>{title}</h1>
            <iframe
                padding="0"
                border="0"
                width="100%"
                height="500"
                src={url}
            ></iframe>
        </>
    );
}
