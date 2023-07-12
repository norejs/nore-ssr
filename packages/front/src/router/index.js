import Home from '../pages/Home';
import Detail from '../pages/Detail';
import { Route } from 'react-router-dom';

export const routes = [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/detail/:id',
        component: Detail,
        exact: true,
    },
];

function RouteWithSubRoutes(route) {
    return (
        <Route
            path={route.path}
            render={(props) => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} />
            )}
            {...route}
        />
    );
}

export default function createRouter() {
    const routeMaps = routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />);
    return routeMaps;
}
