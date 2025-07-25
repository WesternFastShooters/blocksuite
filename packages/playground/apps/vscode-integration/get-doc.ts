import type { Doc, Workspace } from '@blocksuite/affine/store';

export function getDoc(collection: Workspace) {

  const blockCollection = collection.docs.values().next().value as Doc;
  if (!blockCollection) {
    throw new Error('Need to create a doc first');
  }
 const  doc = blockCollection.getStore();

  doc.load();
  doc.resetHistory();

  if (!doc.root) {
    throw new Error('Doc root is not ready');
  }

  return doc;
}