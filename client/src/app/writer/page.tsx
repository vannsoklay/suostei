"use client";

import { SharedAutocompleteContext } from "@/editor/context/SharedAutocompleteContext";
import { SharedHistoryContext } from "@/editor/context/SharedHistoryContext";
import PlaygroundNodes from "@/editor/nodes/PlaygroundNodes";
import { TableContext } from "@/editor/plugins/TablePlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Editor from "./components/Editor";
import PlaygroundEditorTheme from "@/editor/themes/PlaygroundEditorTheme";
import Settings from "@/editor/Setting";
import DocsPlugin from "@/editor/plugins/DocsPlugin";
import PasteLogPlugin from "@/editor/plugins/PasteLogPlugin";
import TestRecorderPlugin from "@/editor/plugins/TestRecorderPlugin";
import TypingPerfPlugin from "@/editor/plugins/TypingPerfPlugin";
import { isDevPlayground } from "@/editor/appSettings";
import { SettingsContext, useSettings } from "@/editor/context/SettingsContext";

export default function Writer() {
  const {
    settings: { isCollab, emptyEditor, measureTypingPerf },
  } = useSettings();
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
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <header>
                {/* <a href="https://lexical.dev" target="_blank" rel="noreferrer">
                <img src={logo} alt="Lexical Logo" />
              </a> */}
              </header>
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
    </SettingsContext>
  );
}
