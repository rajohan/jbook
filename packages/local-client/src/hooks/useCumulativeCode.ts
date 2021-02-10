import { useTypedSelector } from "./useTypedSelector";

const useCumulativeCode = (cellId: string): string => {
    return useTypedSelector((state) => {
        const { data, order } = state.cells;

        const orderedCells = order.map((id) => data[id]);

        const showFunc = `
            import _React from "react";
            import _ReactDOM from "react-dom";
            
            var show = (value) => {
                const root = document.getElementById("root");
                
                if (typeof value === "object") {
                    if(value.$$typeof && value.props) {
                        _ReactDOM.render(value, root)
                    } else {
                        root.innerHTML = JSON.stringify(value);
                    }
                } else {
                    root.innerHTML = value;
                }
            };
        `;

        const showFuncNoOp = "var show = () => {}";

        const mergedCode = [];

        for (const c of orderedCells) {
            if (c.type === "code") {
                if (c.id === cellId) {
                    mergedCode.push(showFunc);
                } else {
                    mergedCode.push(showFuncNoOp);
                }
                mergedCode.push(c.content);
            }

            if (c.id === cellId) {
                break;
            }
        }

        return mergedCode.join("\n");
    });
};

export { useCumulativeCode };
