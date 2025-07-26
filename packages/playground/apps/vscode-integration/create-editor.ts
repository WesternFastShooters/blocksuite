import { RefNodeSlotsProvider } from '@blocksuite/affine/inlines/reference';
import {
  CommunityCanvasTextFonts,
  DocModeProvider,
  EditorSettingExtension,
  FeatureFlagService,
  FontConfigExtension,
  ParseDocUrlExtension,
} from '@blocksuite/affine/shared/services';
import {  type ExtensionType, type Store, type Workspace } from '@blocksuite/affine/store';
import { type TestAffineEditorContainer } from '@blocksuite/integration-test';
import { getTestViewManager } from '@blocksuite/integration-test/view';

import {
  mockDocModeService,
  mockEditorSetting,
  mockParseDocUrlService,
} from '../_common/mock-services';

export type VscodeBlocksuiteEditor = TestAffineEditorContainer & {
  replaceEditorContentInVscode: (json:string)=>void;
  onContentChange: (json:string)=>void;
}

const viewManager = getTestViewManager();


  

export function getCommonExtensions(
  editor: VscodeBlocksuiteEditor
): ExtensionType[] {
  return [
    FontConfigExtension(CommunityCanvasTextFonts),
    EditorSettingExtension({
      setting$: mockEditorSetting(),
    }),
    ParseDocUrlExtension(mockParseDocUrlService(editor.doc.workspace)),
    {
      setup: di => {
        di.override(DocModeProvider, mockDocModeService(editor));
      },
    },
  ];
}

export function createEditor(store: Store, workspace: Workspace) {
  store
    .get(FeatureFlagService)
    .setFlag('enable_advanced_block_visibility', true);

  const editor = document.createElement('affine-editor-container') as VscodeBlocksuiteEditor;

  editor.autofocus = true;
  editor.doc = store;

  const defaultExtensions = getCommonExtensions(editor);
  editor.pageSpecs = [...viewManager.get('page'), ...defaultExtensions];
  editor.edgelessSpecs = [...viewManager.get('edgeless'), ...defaultExtensions];

  editor.std
    .get(RefNodeSlotsProvider)
    .docLinkClicked.subscribe(({ pageId: docId }) => {
      const target = workspace.getDoc(docId)?.getStore();
      if (!target) {
        throw new Error(`Failed to jump to doc ${docId}`);
      }
      target.load();
      editor.doc = target;
    });

  


  return editor;
}


