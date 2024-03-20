"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import useLexicalEditable from "@lexical/react/useLexicalEditable";
import * as React from "react";
import { useEffect, useState } from "react";
// import { CAN_USE_DOM } from "shared/canUseDOM";

// import {createWebsocketProvider} from './collaboration';
import { useSettings } from "@/editor/context/SettingsContext";
import { useSharedHistoryContext } from "@/editor/context/SharedHistoryContext";
import ActionsPlugin from "@/editor/plugins/ActionsPlugin";
import AutocompletePlugin from "@/editor/plugins/AutocompletePlugin";
import AutoEmbedPlugin from "@/editor/plugins/AutoEmbedPlugin";
import AutoLinkPlugin from "@/editor/plugins/AutoLinkPlugin";
import CodeActionMenuPlugin from "@/editor/plugins/CodeActionMenuPlugin";
import CodeHighlightPlugin from "@/editor/plugins/CodeHighlightPlugin";
import CollapsiblePlugin from "@/editor/plugins/CollapsiblePlugin";
import CommentPlugin from "@/editor/plugins/CommentPlugin";
import ComponentPickerPlugin from "@/editor/plugins/ComponentPickerPlugin";
import ContextMenuPlugin from "@/editor/plugins/ContextMenuPlugin";
import DragDropPaste from "@/editor/plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "@/editor/plugins/DraggableBlockPlugin";
import EmojiPickerPlugin from "@/editor/plugins/EmojiPickerPlugin";
import EmojisPlugin from "@/editor/plugins/EmojisPlugin";
import EquationsPlugin from "@/editor/plugins/EquationsPlugin";
import ExcalidrawPlugin from "@/editor/plugins/ExcalidrawPlugin";
import FigmaPlugin from "@/editor/plugins/FigmaPlugin";
import FloatingLinkEditorPlugin from "@/editor/plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "@/editor/plugins/FloatingTextFormatToolbarPlugin";
import ImagesPlugin from "@/editor/plugins/ImagesPlugin";
import InlineImagePlugin from "@/editor/plugins/InlineImagePlugin";
import KeywordsPlugin from "@/editor/plugins/KeywordsPlugin";
import { LayoutPlugin } from "@/editor/plugins/LayoutPlugin/LayoutPlugin";
import LinkPlugin from "@/editor/plugins/LinkPlugin";
import ListMaxIndentLevelPlugin from "@/editor/plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "@/editor/plugins/MarkdownShortcutPlugin";
import { MaxLengthPlugin } from "@/editor/plugins/MaxLengthPlugin";
import MentionsPlugin from "@/editor/plugins/MentionsPlugin";
import PageBreakPlugin from "@/editor/plugins/PageBreakPlugin";
import PollPlugin from "@/editor/plugins/PollPlugin";
import SpeechToTextPlugin from "@/editor/plugins/SpeechToTextPlugin";
import TabFocusPlugin from "@/editor/plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "@/editor/plugins/TableActionMenuPlugin";
import TableCellResizer from "@/editor/plugins/TableCellResizer";
import TableOfContentsPlugin from "@/editor/plugins/TableOfContentsPlugin";
import ToolbarPlugin from "@/editor/plugins/ToolbarPlugin";
import TreeViewPlugin from "@/editor/plugins/TreeViewPlugin";
import TwitterPlugin from "@/editor/plugins/TwitterPlugin";
import YouTubePlugin from "@/editor/plugins/YouTubePlugin";
import ContentEditable from "@/editor/ui/ContentEditable";
import Placeholder from "@/editor/ui/Placeholder";

const skipCollaborationInit =
  // @ts-expect-error
  window.parent != null && window.parent.frames.right === window;

export const CAN_USE_DOM: boolean =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

export default function Editor(): JSX.Element {
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings();
  const isEditable = useLexicalEditable();
  const text = isCollab
    ? "Enter some collaborative rich text..."
    : isRichText
    ? "Enter some rich text..."
    : "Enter some plain text...";
  const placeholder = <Placeholder>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <>
      {isRichText && <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />}
      <div
        className={`editor-container ${showTreeView ? "tree-view" : ""} ${
          !isRichText ? "plain-text" : ""
        }`}
      >
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ComponentPickerPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />

        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
        {/* <CommentPlugin
          providerFactory={isCollab ? createWebsocketProvider : undefined}
        /> */}
        {isRichText ? (
          <>
            {/* {isCollab ? (
              <CollaborationPlugin
                id="main"
                providerFactory={createWebsocketProvider}
                shouldBootstrap={!skipCollaborationInit}
              />
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )} */}
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin
              hasCellMerge={tableCellMerge}
              hasCellBackgroundColor={tableCellBackgroundColor}
            />
            <TableCellResizer />
            <ImagesPlugin />
            <InlineImagePlugin />
            <LinkPlugin />
            <PollPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <FigmaPlugin />
            {!isEditable && <LexicalClickableLinkPlugin />}
            <HorizontalRulePlugin />
            <EquationsPlugin />
            <ExcalidrawPlugin />
            <TabFocusPlugin />
            <TabIndentationPlugin />
            <CollapsiblePlugin />
            <PageBreakPlugin />
            <LayoutPlugin />
            {floatingAnchorElem && !isSmallWidthViewport && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                />
              </>
            )}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin
            charset={isCharLimit ? "UTF-16" : "UTF-8"}
            maxLength={5}
          />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        {shouldUseLexicalContextMenu && <ContextMenuPlugin />}
        <ActionsPlugin isRichText={isRichText} />
      </div>
      {showTreeView && <TreeViewPlugin />}
    </>
  );
}
