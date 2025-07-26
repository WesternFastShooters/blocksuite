import type { StoreExtensionManager } from '@blocksuite/affine/ext-loader';
import { AffineSchemas } from '@blocksuite/affine/schemas';
import { Schema, Transformer } from '@blocksuite/affine/store';
import {
  TestWorkspace,
} from '@blocksuite/affine/store/test';
import * as Y from 'yjs';




export function createStarterDocCollection(
  storeExtensionManager: StoreExtensionManager
) {
  const schema = new Schema();
  schema.register(AffineSchemas);


  const collection = new TestWorkspace();
  collection.storeExtensions = storeExtensionManager.get('store');
  collection.start();

  // debug info
  window.collection = collection;
  window.blockSchemas = AffineSchemas;
  window.job = new Transformer({
    schema,
    blobCRUD: collection.blobSync,
    docCRUD: {
      create: (id: string) => collection.createDoc(id).getStore({ id }),
      get: (id: string) => collection.getDoc(id)?.getStore({ id }) ?? null,
      delete: (id: string) => collection.removeDoc(id),
    },
  });
  window.Y = Y;

  return collection;
}

export async function initStarterDocCollection(collection: TestWorkspace) {
    collection.meta.initialize();
  
    const doc = collection.createDoc('doc:home');
  
  
    const store = doc.getStore({ id: 'doc:home' });
    store.load();
  
     store.addBlock('affine:page', {
    });
  
    store.resetHistory();

    if (!doc?.loaded) {
      doc?.load();
    }
  }