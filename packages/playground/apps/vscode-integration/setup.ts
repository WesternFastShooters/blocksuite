import { DocModeProvider } from '@blocksuite/affine/shared/services';
import type {  Workspace } from '@blocksuite/affine/store';


import { createApp } from './create-app.js';
import { getDoc } from './get-doc.js';



export async function mountEditor(collection: Workspace, container: HTMLElement) {
    const app = document.getElementById('app');
    if (!app) return;
  
    const doc = getDoc(collection);
  
    const editor = await createApp(doc, collection, container);
  
    const modeService = editor.std.provider.get(DocModeProvider);
    editor.mode = modeService.getPrimaryMode(doc.id);
  
  
    return editor;
}

