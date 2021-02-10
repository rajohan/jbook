import "./preview.css";

import React, { useEffect, useRef } from "react";

interface PreviewProps {
    code: string;
    bundlingError: string;
}

const html = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title></title>
        </head>
        <body>
            <div id="root"></div>
            <script>
                const handleError = (error) => {
                    const root = document.getElementById("root");
                        root.innerHTML = "<div style='color: red;'><h4>Runtime Error</h4>" + error + "</div>";
                        console.error(error);
                }
                
                window.addEventListener("error", (event) => {
                    event.preventDefault();
                    handleError(event.error);
                });
                
                window.addEventListener("message", (event) => {
                    try {
                        eval(event.data);
                    } catch (error) {
                        handleError(error);
                    }
                }, false);
            </script>
        </body>
    </html>
`;

const Preview: React.FC<PreviewProps> = ({ code, bundlingError }: PreviewProps) => {
    const ref = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.srcdoc = html;

            setTimeout(() => {
                ref.current?.contentWindow?.postMessage(code, "*");
            }, 50);
        }
    }, [code]);

    return (
        <div className="preview-wrapper">
            <iframe title="preview" ref={ref} sandbox="allow-scripts" srcDoc={html} />
            {bundlingError && (
                <div className="preview-error">
                    <h4>Build Error</h4>
                    {bundlingError}
                </div>
            )}
        </div>
    );
};

export default Preview;
