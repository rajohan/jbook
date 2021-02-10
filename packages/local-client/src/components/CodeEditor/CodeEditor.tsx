import "./codeEditor.css";

import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import MonacoJSXHighlighter from "monaco-jsx-highlighter";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import React, { useRef } from "react";

interface CodeEditorProps {
    initialValue: string;
    onChange: (value: string) => void;
}

const babelParse = (code: string) =>
    parse(code, {
        sourceType: "module",
        plugins: ["jsx"],
    });

const CodeEditor: React.FC<CodeEditorProps> = ({
    initialValue,
    onChange,
}: CodeEditorProps) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const onEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        const monacoJSXHighlighter = new MonacoJSXHighlighter(
            monaco,
            babelParse,
            traverse,
            editor
        );

        monacoJSXHighlighter.addJSXCommentCommand();

        editor.onDidChangeModelContent(() => {
            onChange(editor.getValue());
            monacoJSXHighlighter.highlightCode();
        });

        editor.getModel()?.updateOptions({ tabSize: 4 });
    };

    const onFormatClick = () => {
        if (editorRef.current) {
            const unformatted = editorRef.current.getValue();

            try {
                const formatted = prettier
                    .format(unformatted, {
                        parser: "babel",
                        plugins: [parser],
                        semi: true,
                        trailingComma: "es5",
                        singleQuote: false,
                        printWidth: 90,
                        tabWidth: 4,
                        endOfLine: "lf",
                        useTabs: false,
                    })
                    .replace(/\n$/, "");

                editorRef.current?.setValue(formatted);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="editor-wrapper">
            <button
                className="button button-format is-primary is-small"
                onClick={onFormatClick}
            >
                Format
            </button>
            <MonacoEditor
                defaultValue={initialValue}
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                onMount={onEditorDidMount}
                keepCurrentModel={true}
                options={{
                    wordWrap: "on",
                    minimap: { enabled: false },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;
