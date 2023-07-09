import React, { useState, useEffect, useCallback } from 'react';
import { getNewsList } from '../apis/news';
import NewsList from '../components/News/NewsList';

export default function Home() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        console.log('Home useEffect');
        const fetchInstance = fetch();
        return () => {
            try {
                fetchInstance.cancel();
            } catch (error) {}
        };
    }, []);
    const fetch = useCallback(async () => {
        // fetch data
        setLoading(true);
        const res = await getNewsList();
        const { result, reason } = res;
        if (result?.data) {
            setList(result.data);
        } else {
            setError(reason);
            setList([]);
        }
        setLoading(false);
    }, []);
    return (
        <>
            <h1>Home</h1>
            <NewsList list={list} loading={loading} error={error}></NewsList>
        </>
    );
}
