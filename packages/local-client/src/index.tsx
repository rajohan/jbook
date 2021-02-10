import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles.css";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import CellList from "./components/CellList/cellList";
import { store } from "./store";

const App = () => {
    return (
        <Provider store={store}>
            <CellList />
        </Provider>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
