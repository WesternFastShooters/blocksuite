import './style.css';
import { effects as itEffects } from '@blocksuite/integration-test/effects';
import { createStarterDocCollection } from '../starter/utils/collection';
import { getTestStoreManager } from './store-manager';
import { initStarterDocCollection } from './collection';
import { mountEditor } from './setup';
import { effects as commentEffects } from '../comment/effects.js';
import { editorConfig } from './editor-config';
import type { VscodeBlocksuiteEditor } from './create-editor';


interface InitBlocksuiteEditorOptions{
  container: HTMLElement;
}


export async function createBlocksuiteEditor({
  container,
}: InitBlocksuiteEditorOptions) {
  itEffects();
  const storeManager = getTestStoreManager();
  if (window.collection) return;
  commentEffects();


  const collection = createStarterDocCollection(storeManager);
  await initStarterDocCollection(collection);
  const editor = await mountEditor(collection,container);
  editorConfig(editor as VscodeBlocksuiteEditor);
  return editor;
  
}

