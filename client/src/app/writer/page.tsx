"use client";

import { SharedAutocompleteContext } from "@/editor/context/SharedAutocompleteContext";
import { SharedHistoryContext } from "@/editor/context/SharedHistoryContext";
import PlaygroundNodes from "@/editor/nodes/PlaygroundNodes";
import { TableContext } from "@/editor/plugins/TablePlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Editor from "./components/Editor";
import PlaygroundEditorTheme from "@/editor/themes/PlaygroundEditorTheme";

export default function Writer() {
  const initialConfig = {
    // editorState: isCollab
    //   ? null
    //   : emptyEditor
    //   ? undefined
    //   : prepopulatedRichText,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            {/* <header>
              <a href="https://lexical.dev" target="_blank" rel="noreferrer">
                <img src={logo} alt="Lexical Logo" />
              </a>
            </header> */}
            <div className="editor-shell">
              <Editor />
            </div>
            {/* <Settings />
            {isDevPlayground ? <DocsPlugin /> : null}
            {isDevPlayground ? <PasteLogPlugin /> : null}
            {isDevPlayground ? <TestRecorderPlugin /> : null}

            {measureTypingPerf ? <TypingPerfPlugin /> : null} */}
          </SharedAutocompleteContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}
