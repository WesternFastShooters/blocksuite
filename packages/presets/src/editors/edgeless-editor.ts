import { EdgelessEditorBlockSpecs } from '@blocksuite/blocks';
import { noop } from '@blocksuite/global/utils';
import {
  BlockSuiteRoot,
  ShadowlessElement,
  WithDisposable,
} from '@blocksuite/lit';
import type { Page } from '@blocksuite/store';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

noop(BlockSuiteRoot);

@customElement('edgeless-editor')
export class EdgelessEditor extends WithDisposable(ShadowlessElement) {
  @property({ attribute: false })
  page!: Page;

  @property({ attribute: false })
  preset = EdgelessEditorBlockSpecs;

  root: Ref<BlockSuiteRoot> = createRef<BlockSuiteRoot>();

  override render() {
    return html`
      <style>
        edgeless-editor * {
          box-sizing: border-box;
        }
        edgeless-editor {
          display: block;
          height: 100%;
          position: relative;
          overflow: hidden;
          font-family: var(--affine-font-family);
          background: var(--affine-background-primary-color);
        }
        @media print {
          edgeless-editor {
            height: auto;
          }
        }
      </style>
      <block-suite-root
        ${ref(this.root)}
        .page=${this.page}
        .preset=${this.preset}
      ></block-suite-root>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-editor': EdgelessEditor;
  }
}