import { rest } from 'msw';
// 用mockjs 生成新闻列表数据
import Mock from 'mockjs';
const Random = Mock.Random;
const newsList = function () {
    let newsList = [];
    for (let i = 0; i < 10; i++) {
        let news = {
            id: Random.guid(),
            title: Random.ctitle(10, 20),
            content: Random.cparagraph(10, 20),
            time: Random.date('yyyy-MM-dd'),
        };
        newsList.push(news);
    }
    return newsList;
};
const newsDetail = function () {
    let newsDetail = {
        id: Random.guid(),
        title: Random.ctitle(10, 20),
        content: Random.cparagraph(10, 20),
        time: Random.date('yyyy-MM-dd'),
    };
    return newsDetail;
};

export const handlers = [
    rest.post('/login', (req, res, ctx) => {
        // Persist user's authentication in the session
        sessionStorage.setItem('is-authenticated', 'true');

        return res(
            // Respond with a 200 status code
            ctx.status(200)
        );
    }),
    rest.get('/news/index', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.json({
                result: newsList(),
            })
        );
    }),
    rest.get('/news/content', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.json({
                result: newsDetail(),
            })
        );
    }),
    rest.get('/user', (req, res, ctx) => {
        // Check if the user is authenticated in this session
        const isAuthenticated = sessionStorage.getItem('is-authenticated');

        if (!isAuthenticated) {
            // If not authenticated, respond with a 403 error
            return res(
                ctx.status(403),
                ctx.json({
                    errorMessage: 'Not authorized',
                })
            );
        }

        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.json({
                username: 'admin',
            })
        );
    }),
];
