import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

import { actionCreators } from "../store";

const useActions = (): typeof actionCreators => {
    const dispatch = useDispatch();

    return useMemo(() => {
        return bindActionCreators(actionCreators, dispatch);
    }, [dispatch]);
};

export { useActions };
