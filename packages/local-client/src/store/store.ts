import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";

import * as actionCreators from "./actionCreators";
import { persistMiddleware } from "./middlewares/persistMiddleware";
import reducers from "./reducers";

const composeEnhancers = composeWithDevTools({ actionCreators });

export const store = createStore(
    reducers,
    {},
    composeEnhancers(applyMiddleware(thunk, persistMiddleware))
);
