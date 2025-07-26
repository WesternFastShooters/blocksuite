import { Store, } from "@blocksuite/affine/store";
import type { VscodeBlocksuiteEditor } from "./create-editor";

async function replaceEditorContent(editor: VscodeBlocksuiteEditor, newJsonContentString: string,) {

    const newDocSnapshot = JSON.parse(newJsonContentString);
    
    const newStore = await window.job.snapshotToDoc(newDocSnapshot);

    editor.doc = newStore!;
}


export const editorConfig = (editor: VscodeBlocksuiteEditor) => {
    editor.replaceEditorContentInVscode = (json: string) => {
        replaceEditorContent(editor, json);
    }


    editor.doc.slots.blockUpdated.subscribe(() => {
        const docToJSON = (doc: Store): string => {
            const docSnapshot = window.job.docToSnapshot(doc);
            return JSON.stringify(docSnapshot);
        }
        editor.onContentChange?.(docToJSON(editor.doc));
    })
}