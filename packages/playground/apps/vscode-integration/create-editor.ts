import { RefNodeSlotsProvider } from '@blocksuite/affine/inlines/reference';
import {
  CommunityCanvasTextFonts,
  DocModeProvider,
  EditorSettingExtension,
  FeatureFlagService,
  FontConfigExtension,
  ParseDocUrlExtension,
} from '@blocksuite/affine/shared/services';
import { Transformer, type ExtensionType, type Store, type Workspace } from '@blocksuite/affine/store';
import { type TestAffineEditorContainer } from '@blocksuite/integration-test';
import { getTestViewManager } from '@blocksuite/integration-test/view';

import {
  mockDocModeService,
  mockEditorSetting,
  mockParseDocUrlService,
} from '../_common/mock-services';

type VscodeBlocksuiteEditor = TestAffineEditorContainer & {
  replaceEditorContentInVscode: (json:string)=>void;
  onContentChange: (json:string)=>void;
}

const viewManager = getTestViewManager();

async function replaceEditorContent(editor: VscodeBlocksuiteEditor,currentStore: Store, collection: Workspace, newJsonContentString: string, ) {
    const transformerOptions = {
      schema: currentStore.schema,
      blobCRUD: collection.blobSync,
      docCRUD: {
        create: (id: string) => collection.createDoc(id).getStore({ id }),
        get: (id: string) => collection.getDoc(id)?.getStore({ id }) ?? null,
        delete: (id: string) => collection.removeDoc(id),
      },
    };
    const transformer = new Transformer(transformerOptions);
  
    // 2. 加载新的 JSON 内容并应用到当前文档
    const newDocSnapshot = JSON.parse(newJsonContentString);
    const newStore = await transformer.snapshotToDoc(newDocSnapshot);
  
    editor.doc = newStore!;
  }
  

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

  editor.replaceEditorContentInVscode = (json:string)=>{
    replaceEditorContent(editor,store,workspace,json);
  }


  editor.doc.slots.blockUpdated.subscribe(()=>{
    const docToJSON = (doc:Store):string=>{
        const transformer = new Transformer({
          schema: doc.schema,
          blobCRUD: workspace.blobSync,
          docCRUD: {
            create: (id: string) => workspace.createDoc(id).getStore({ id }),
            get: (id: string) => workspace.getDoc(id)?.getStore({ id }) ?? null,
            delete: (id: string) => workspace.removeDoc(id),
          },
        });
        const docSnapshot = transformer.docToSnapshot(doc);
        return JSON.stringify(docSnapshot);
      }
    editor.onContentChange?.(docToJSON(editor.doc));
  })


  return editor;
}


