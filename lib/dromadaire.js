'use babel';

import DromadaireView from './dromadaire-view';
import { CompositeDisposable } from 'atom';

export default {

  dromadaireView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.dromadaireView = new DromadaireView(state.dromadaireViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.dromadaireView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dromadaire:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.dromadaireView.destroy();
  },

  serialize() {
    return {
      dromadaireViewState: this.dromadaireView.serialize()
    };
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      if (selection.indexOf('_') === -1){
        let reversed = selection.split(/(?=[A-Z])/).join('_').toLocaleLowerCase()
        editor.insertText(reversed)
      } else {
        let reversed = selection.split('_')[0] + selection.split('_').slice(1).map((st) => { return st.charAt(0).toUpperCase()+st.slice(1) } ).join('')
        editor.insertText(reversed)
      }
    }
  }

};
