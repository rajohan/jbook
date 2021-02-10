import "./cellListItem.css";

import React from "react";

import { Cell } from "../../store";
import ActionBar from "../ActionBar/ActionBar";
import CodeCell from "../CodeCell/CodeCell";
import TextEditor from "../TextEditor/TextEditor";

interface CellListItemProps {
    cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }: CellListItemProps) => {
    let child: JSX.Element;

    if (cell.type === "code") {
        child = (
            <React.Fragment>
                <div className="action-bar-wrapper">
                    <ActionBar id={cell.id} />
                </div>
                <CodeCell cell={cell} />
            </React.Fragment>
        );
    } else {
        child = (
            <React.Fragment>
                <ActionBar id={cell.id} />
                <TextEditor cell={cell} />
            </React.Fragment>
        );
    }

    return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
