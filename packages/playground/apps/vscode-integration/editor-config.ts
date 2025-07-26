import { Store, Transformer, type Workspace } from "@blocksuite/affine/store";
import type { VscodeBlocksuiteEditor } from "./create-editor";

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

export const editorConfig = (editor: VscodeBlocksuiteEditor, ...props: any)=>{
    const {store,workspace} = props;
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
}