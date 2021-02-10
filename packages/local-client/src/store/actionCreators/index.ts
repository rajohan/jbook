import axios from "axios";
import { Dispatch } from "redux";

import bundler from "../../bundler";
import {
    Action,
    DeleteCellAction,
    Direction,
    InsertCellAfterAction,
    MoveCellAction,
    UpdateCellAction,
} from "../actions";
import { ActionType } from "../actionTypes";
import { Cell, CellTypes } from "../cell";
import { RootState } from "../reducers";

export const updateCell = (id: string, content: string): UpdateCellAction => {
    return {
        type: ActionType.UPDATE_CELL,
        payload: {
            id,
            content,
        },
    };
};

export const deleteCell = (id: string): DeleteCellAction => {
    return {
        type: ActionType.DELETE_CELL,
        payload: {
            id,
        },
    };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
    return {
        type: ActionType.MOVE_CELL,
        payload: {
            id,
            direction,
        },
    };
};

export const insertCellAfter = (
    id: string | null,
    cellType: CellTypes
): InsertCellAfterAction => {
    return {
        type: ActionType.INSERT_CELL_AFTER,
        payload: {
            id,
            type: cellType,
        },
    };
};

export const createBundle = (cellId: string, input: string) => {
    return async (dispatch: Dispatch<Action>): Promise<void> => {
        dispatch({
            type: ActionType.BUNDLE_START,
            payload: {
                cellId,
            },
        });

        const result = await bundler(input);

        dispatch({
            type: ActionType.BUNDLE_COMPLETE,
            payload: {
                cellId,
                bundle: {
                    code: result.code,
                    error: result.error,
                },
            },
        });
    };
};

export const fetchCells = () => {
    return async (dispatch: Dispatch<Action>): Promise<void> => {
        dispatch({ type: ActionType.FETCH_CELLS });

        try {
            const { data }: { data: Cell[] } = await axios.get("/cells");

            dispatch({
                type: ActionType.FETCH_CELLS_COMPLETE,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: ActionType.FETCH_CELLS_ERROR,
                payload: error.message,
            });
        }
    };
};

export const saveCells = () => {
    return async (
        dispatch: Dispatch<Action>,
        getState: () => RootState
    ): Promise<void> => {
        const {
            cells: { data, order },
        } = getState();

        const cells = order.map((id) => data[id]);

        try {
            await axios.post("cells", { cells });
        } catch (error) {
            dispatch({
                type: ActionType.SAVE_CELLS_ERROR,
                payload: error.message,
            });
        }
    };
};
