import './style.css';
import { effects as itEffects } from '@blocksuite/integration-test/effects';
import { createStarterDocCollection } from '../starter/utils/collection';
import { getTestStoreManager } from './store-manager';
import { initStarterDocCollection } from './collection';
import { mountEditor } from './setup';

interface InitBlocksuiteEditorOptions{
  container: HTMLElement;
}


export async function initBlocksuiteEditor({
  container,
}: InitBlocksuiteEditorOptions) {
  itEffects();
  const storeManager = getTestStoreManager();
  if (window.collection) return;

  const collection = createStarterDocCollection(storeManager);
  await initStarterDocCollection(collection);
  const editor = await mountEditor(collection,container);
  return editor;
  
}

