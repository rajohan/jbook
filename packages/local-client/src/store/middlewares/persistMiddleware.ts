import { Dispatch } from "redux";

import { saveCells } from "../actionCreators";
import { Action } from "../actions";
import { ActionType } from "../actionTypes";
import { RootState } from "../reducers";

type Next = (action: Action) => void;
type ReturnType = (next: Next) => (action: Action) => void;
type Args = { dispatch: Dispatch<Action>; getState: () => RootState };

const persistMiddleware = ({ dispatch, getState }: Args): ReturnType => {
    let timer: NodeJS.Timeout;

    return (next: Next) => {
        return (action: Action) => {
            next(action);

            const actions = [
                ActionType.MOVE_CELL,
                ActionType.UPDATE_CELL,
                ActionType.INSERT_CELL_AFTER,
                ActionType.DELETE_CELL,
            ];

            if (actions.includes(action.type)) {
                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(() => {
                    saveCells()(dispatch, getState);
                }, 1000);
            }
        };
    };
};

export { persistMiddleware };
