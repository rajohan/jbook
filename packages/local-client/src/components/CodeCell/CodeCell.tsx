import "./CodeCell.css";

import React, { useEffect } from "react";

import { useActions } from "../../hooks/useActions";
import { useCumulativeCode } from "../../hooks/useCumulativeCode";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { Cell } from "../../store";
import CodeEditor from "../CodeEditor/CodeEditor";
import Preview from "../Preview/Preview";
import Resizable from "../Resizable/Resizable";

interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }: CodeCellProps) => {
    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector((state) => state.bundles[cell.id]);
    const cumulativeCode = useCumulativeCode(cell.id);

    useEffect(() => {
        if (!bundle) {
            createBundle(cell.id, cumulativeCode);
            return;
        }

        const timer = setTimeout(async () => {
            createBundle(cell.id, cumulativeCode);
        }, 750);

        return () => {
            clearTimeout(timer);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cell.id, cumulativeCode, createBundle]);

    return (
        <Resizable direction="vertical">
            <div className="code-cell">
                <Resizable direction="horizontal">
                    <CodeEditor
                        initialValue={cell.content}
                        onChange={(value) => updateCell(cell.id, value)}
                    />
                </Resizable>
                <div className="preview-wrapper">
                    {!bundle || bundle.loading ? (
                        <div className="progress-cover">
                            <progress className="progress is-small is-primary" max="100">
                                Loading
                            </progress>
                        </div>
                    ) : (
                        <Preview code={bundle.code} bundlingError={bundle.error} />
                    )}
                </div>
            </div>
        </Resizable>
    );
};

export default CodeCell;
