import { DocModeProvider } from '@blocksuite/affine/shared/services';
import type { Store, Workspace, Schema } from '@blocksuite/affine/store';
import { Transformer } from '@blocksuite/affine/store'; 

import { createApp } from './create-app.js';
import { getDoc } from './get-doc.js';


export async function loadEditorContentFromJson(collection: Workspace, jsonString: string, schema: Schema): Promise<Store | undefined> {
  const docSnapshot = JSON.parse(jsonString);

  const transformerOptions = {
    schema: schema, // 使用传入的 schema
    blobCRUD: collection.blobSync,
    docCRUD: {
      create: (id: string) => collection.createDoc(id).getStore({ id }),
      get: (id: string) => collection.getDoc(id)?.getStore({ id }) ?? null,
      delete: (id: string) => collection.removeDoc(id),
    },
  };
  const transformer = new Transformer(transformerOptions);
  
  const doc = await transformer.snapshotToDoc(docSnapshot);
  if (!doc) {
    console.error('Failed to load doc from snapshot');
    return undefined;
  }
  return doc;
}


export async function mountEditor(collection: Workspace, container: HTMLElement) {
    const app = document.getElementById('app');
    if (!app) return;
  
    const doc = getDoc(collection);
  
    const editor = await createApp(doc, collection, container);
  
    const modeService = editor.std.provider.get(DocModeProvider);
    editor.mode = modeService.getPrimaryMode(doc.id);
  
  
    return editor;
}

