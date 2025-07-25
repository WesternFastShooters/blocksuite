import '../../style.css';
import { effects as itEffects } from '@blocksuite/integration-test/effects';
import { getTestStoreManager } from '@blocksuite/integration-test/store';

import { setupEdgelessTemplate } from '../_common/setup.js';
import { effects as commentEffects } from '../comment/effects.js';
import { createStarterDocCollection, initStarterDocCollection } from '../starter/utils/collection';
import { mountDefaultDocEditor } from '../starter/utils/setup-playground';



export async function initBlocksuiteEditor() {
  itEffects();
  const storeManager = getTestStoreManager();
  commentEffects();
  if (window.collection) return;

  setupEdgelessTemplate();

  const collection = createStarterDocCollection(storeManager);

  await initStarterDocCollection(collection);
  await mountDefaultDocEditor(collection);
}

