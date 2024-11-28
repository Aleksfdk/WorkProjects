/* eslint-disable @typescript-eslint/no-explicit-any */

export const setWrapperForTextEditor = (styles: Record<string, string>) => {
  const element = document.querySelector('.ck-editor__editable');

  if (element) {
    const wrapper = document.createElement('div');
    const resizeHandle = document.createElement('div');
    const line = document.createElement('div');

    wrapper.classList.add(styles.wrapper);
    resizeHandle.classList.add(styles.resizeHandle);
    line.classList.add(styles.line);

    element.parentNode?.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    wrapper.appendChild(resizeHandle);
    for (let i = 0; i < 3; i++) {
      const newLine = line.cloneNode(true);
      resizeHandle.appendChild(newLine);
    }
  }
};

export const setResizeInBottom = (styles: Record<string, string>) => {
  let startY: number;
  let startHeight: number;

  const startResize = (event: MouseEvent) => {
    startY = event.clientY;
    const wrapper = document.querySelector(`.${styles.wrapper}`);
    if (wrapper) {
      const computedStyle = document.defaultView?.getComputedStyle(wrapper);
      if (computedStyle && computedStyle.height) {
        startHeight = parseInt(computedStyle.height, 10);
      }
    }
    document.documentElement.addEventListener('mousemove', resize);
    document.documentElement.addEventListener('mouseup', stopResize);
  };

  const resize = (event: MouseEvent) => {
    const deltaY = event.clientY - startY;
    const wrapper = document.querySelector(`.${styles.wrapper}`) as HTMLElement;
    if (wrapper) {
      wrapper.style.height = startHeight + deltaY + 'px';
    }
  };
  const stopResize = () => {
    document.documentElement.removeEventListener('mousemove', resize);
    document.documentElement.removeEventListener('mouseup', stopResize);
  };

  const editorContent = document.querySelector(`.${styles.resizeHandle}`);
  editorContent?.addEventListener('mousedown', (event: Event) => {
    startResize(event as MouseEvent);
  });
};

export const addIndentForTextLineByTab = (editor: any) => {
  editor.editing.view.document.on('keydown', (_: any, data: any) => {
    if (data.domEvent.key === 'Tab') {
      data.preventDefault();

      const selectionPosition = editor.model.document.selection.getFirstPosition();

      if (selectionPosition) {
        editor.model.change((writer: any) => {
          writer.insertText('    ', selectionPosition);
        });
      }
    }
  });
};

export const addAllowedTagsInFilterData = (editor: any) => {
  editor.plugins.get('DataFilter').loadAllowedConfig([{ name: 'details' }, { name: 'summary' }]);
};

export const changeTooltipOfToolbarElementCode = (editor: any) => {
  const toolbar = editor.ui.view.toolbar;
  const items = toolbar.items['_items'];
  items[21]['element']['attributes']['data-cke-tooltip-text'].value = 'В формате кода';
};

export const removeFormatForCopyPaste = (editor: any) => {
  editor.editing.view.document.on('clipboardInput', (_: any, data: any) => {
    if (data.method === 'drop') return;
    data.content = editor.data.htmlProcessor.toView(data.dataTransfer.getData('text/plain'));
  });
};

export const insertToolbarBeforeInit = (editor: any) => {
  // Insert the toolbar before the editable area.
  editor.ui
    .getEditableElement()
    ?.parentElement?.insertBefore(editor.ui.view.toolbar.element as Node, editor.ui.getEditableElement() as Node);
};
