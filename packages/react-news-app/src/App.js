import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NavBar from './components/NavBar/NavBar';
import News from './components/News/News';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { router } from './config/config';
import LoadingBar from 'react-top-loading-bar';

function App({ isSSR = false, location, SSRRouter }) {
    const [progress, setProgress] = useState(0);
    const pageSize = 7;
    const Router = isSSR ? SSRRouter : BrowserRouter;
    return (
        <>
            <Router location={location}>
                <NavBar />
                <LoadingBar color="#005abb" height={3} progress={progress} />
                <Routes>
                    {router.map((path) => (
                        <Route
                            exact
                            key={uuidv4()}
                            path={path.path}
                            element={
                                <News
                                    setProgress={setProgress}
                                    key={path.key}
                                    category={path.category}
                                    pageSize={pageSize}
                                    country={path.country}
                                />
                            }
                        />
                    ))}
                </Routes>
            </Router>
        </>
    );
}

export default App;
