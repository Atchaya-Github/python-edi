import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

const INIT_CONTENT = '';
const THEME = 'ace/theme/github';
const LANG = 'ace/mode/javascript';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css']
}) export class MainPageComponent implements AfterViewInit {

  constructor() { }

  private editorBeautify:any; // beautify extension
  @ViewChild('codeEditor') private codeEditorElmRef!: ElementRef;
  
  private codeEditor!: ace.Ace.Editor;
  @Input() content!: string;



  ngAfterViewInit () {
      ace.require('ace/ext/language_tools');
      const element = this.codeEditorElmRef.nativeElement;
      const editorOptions = this.getEditorOptions();
      this.codeEditor = this.createCodeEditor(element, editorOptions);
      this.setContent(this.content || INIT_CONTENT);
      // hold reference to beautify extension
      this.editorBeautify = ace.require('ace/ext/beautify');
  }


  private createCodeEditor(element: Element, options: any): ace.Ace.Editor {
      const editor = ace.edit(element, options);
      editor.setTheme(THEME);
      editor.getSession().setMode(LANG);
      editor.setShowFoldWidgets(true);
      return editor;
  }

  // missing propery on EditorOptions 'enableBasicAutocompletion' so this is a wolkaround still using ts
  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
      const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
          highlightActiveLine: true,
          minLines: 14,
          maxLines: Infinity,
      };
      const extraEditorOptions = { enableBasicAutocompletion: true };
      return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  /**
   * @returns - the current editor's content.
   */
  public getContent(): string | undefined {
    if (this.codeEditor) {
      const code = this.codeEditor.getValue();
      return code;
    }
    return undefined;
  }
  

  /**
   * @param content - set as the editor's content.
   */
  public setContent(content: string): void {
      if (this.codeEditor) {
          this.codeEditor.setValue(content);
      }
  }

  /**
   * @description
   *  beautify the editor content, rely on Ace Beautify extension.
   */
  public beautifyContent() {
      if (this.codeEditor && this.editorBeautify) {
          const session = this.codeEditor.getSession();
          this.editorBeautify.beautify(session);
      }
  }
  public consoleCode() {
    console.log(this.getContent());
  }


  /**
   * @event OnContentChange - a proxy event to Ace 'change' event - adding additional data.
   * @param callback - recive the corrent content and 'change' event's original parameter.
   */
  public OnContentChange(callback: (content: string, delta: ace.Ace.Delta) => void): void {
      this.codeEditor.on('change', (delta) => {
          const content = this.codeEditor.getValue();
          callback(content, delta);
      });
  }
  
}

