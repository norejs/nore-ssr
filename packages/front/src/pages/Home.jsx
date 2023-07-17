import React, { useState, useEffect, useCallback } from 'react';
import { getNewsList } from '../apis/news';
import NewsList from '../components/News/NewsList';
import { Counter } from '../features/counter/Counter';

export default function Home() {
    const [list, setList] = useState([]);

    const fetch = useCallback(async () => {
        const res = await getNewsList();
        const { result } = res;
        if (result) {
            setList(result);
        } else {
            setList([]);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return (
        <>
            <h1>Home</h1>
            <Counter />
            <NewsList list={list}></NewsList>
        </>
    );
}
