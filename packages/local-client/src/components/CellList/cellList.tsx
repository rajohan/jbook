import "./cellList.css";

import React, { useEffect } from "react";

import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import AddCell from "../AddCell/AddCell";
import CellListItem from "./cellListItem";

const CellList: React.FC = () => {
    const cells = useTypedSelector(({ cells: { order, data } }) => {
        return order.map((id) => {
            return data[id];
        });
    });
    const { fetchCells } = useActions();

    useEffect(() => {
        fetchCells();
    }, [fetchCells]);

    const renderedCells = cells.map((cell) => (
        <React.Fragment key={cell.id}>
            <CellListItem cell={cell} />
            <AddCell previousCellId={cell.id} />
        </React.Fragment>
    ));

    return (
        <div className="cell-list">
            <AddCell forceVisible={cells.length === 0} previousCellId={null} />
            {renderedCells}
        </div>
    );
};

export default CellList;
