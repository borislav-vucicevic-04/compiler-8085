import React, { Component } from 'react'
import StyleSheet from './App.module.css'
import INSTRUCTION_CODES from './instruction_codes.json';
import logo from './logo.svg'

interface IAppState {
  showPreloader: boolean,
  showHelpDialog: boolean,
  formattedCode: string[],
  rawCode: string,
  machineCode: string[],
  error?: React.ReactNode
}

export default class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.format = this.format.bind(this);
    this.compile = this.compile.bind(this);
    this.generateCompilationResult = this.generateCompilationResult.bind(this);
    this.toggleHelpDialog = this.toggleHelpDialog.bind(this);
    this.textArea_HandleChange = this.textArea_HandleChange.bind(this);
    this.state = {
      showPreloader: true,
      showHelpDialog: false,
      formattedCode: [],
      rawCode: '; Write your code here',
      machineCode: []
    }
  }
  textArea_HandleChange(e: React.ChangeEvent) {
    this.setState({
      rawCode: (e.target as HTMLTextAreaElement).value
    })
  }
  format(code: string){

    // transform all code into upper case and then splitting it into lines
    let formatted: string[] = code.toUpperCase().split('\n');
    // removing leading and trailling white space from each line of code
    formatted = formatted.map(item => item.trimStart().trimEnd());
    // removing any comments from line codes
    formatted = formatted.map(item => {
      let ri = item;
      let commentStartsAt = ri.indexOf(';');

      if(commentStartsAt >= 0) ri = ri.substring(0, commentStartsAt);

      return ri.trim();
    });

    return formatted
  }
  compile() {
    const code: string[] = this.format(this.state.rawCode);
    const instruction_codes: any = INSTRUCTION_CODES;
    let error: React.ReactNode | undefined;
    const machineCode: string[] = [];
    compile_loop: for (let i = 0; i < code.length; i++) {
      const line = code[i];
      if(code[code.length - 1] !== "HLT") {
        error = <div className={StyleSheet.error}>
          <span>{`Syntax error: `}</span>
          <br />
          <span>{`\tEvery program must end with the "HLT" instruction!!!`}</span>
        </div>
        break;
      }
      if(code.filter(instruction => instruction === "HLT").length !== 1) {
        error = <div className={StyleSheet.error}>
          <span>{`Syntax error: `}</span>
          <br />
          <span>{`\tEvery program must have only `}<u>{"ONE"}</u>{` "HLT" instruction!!!`}</span>
        </div>
        break;
      }
      if(line[i] === ";" || line.length === 0) continue
      if(line.split(' ')[0] === "MVI") {
        const pattern = /^MVI\s[A-C],([0-9A-F][0-9A-F])$/;
        console.log(line, pattern.test(line))
        if(!pattern.test(line)) {
          error = this.generateErrorElement(i, line);
          break compile_loop;
        }
        const inst = line.split(',')[0];
        const operand = line.split(',')[1];

        machineCode.push(instruction_codes[inst]);
        machineCode.push(operand);
      }
      else if(instruction_codes[line]) {
        machineCode.push(instruction_codes[line]);
      }
      else {
        error = this.generateErrorElement(i, line);
        break;
      }
    }
  
    this.setState({
      machineCode,
      error
    })
  }
  generateErrorElement(lineNumber: number, lineCode: string): React.ReactNode {
    return <div className={StyleSheet.error}>
    <span>{`Syntax error on line ${lineNumber}: `}</span>
    <br />
    <span>{`\t${lineCode}`}</span>
  </div>
  }
  generateCompilationResult(): React.ReactNode {
    const machineCode = this.state.machineCode;
    const error = this.state.error;
    if(error !== undefined) return error;
    if(machineCode.length === 0) return <div style={{width: '100%', textAlign: 'left', fontStyle: 'italic'}}>{'Write some code and compile it...'}</div>
    return <table className={StyleSheet['memory-table']}>
      <thead>
        <tr>
          <th>{'Address: '}</th>
          <th>{'Value: '}</th>
        </tr>
      </thead>
      <tbody>{
        machineCode.map((item, index) => {
          const address = `C${index.toString(16).toUpperCase().padStart(3, '0')}`;
          return <tr key={address}>
            <td>{address}</td>
            <td>{item}</td>
          </tr>
        }) 
      }</tbody>
    </table>
  }
  toggleHelpDialog() {
    const showHelpDialog = !this.state.showHelpDialog;
    this.setState({
      showHelpDialog
    });
  }
  componentDidMount(): void {
    setTimeout(() => {
      this.setState({ showPreloader: false})
    }, 2249);
  }
  render() {
    return (
      <div className={StyleSheet.App}>
        <div className={StyleSheet.preloader} style={{display: this.state.showPreloader ? 'flex' : 'none'}}>
          <img src={logo} height={384} width={384}></img>
          <span>BORISLAV VUČIĆEVIĆ</span>
        </div>
        <div className={StyleSheet['dialog-overlay']} style={{display: this.state.showHelpDialog ? 'flex' : 'none'}}>
          <div className={StyleSheet['dialog-body']}>
            <h1>Help dialog</h1>
            <hr></hr>
            <p>Please write your code in the text box. After you are done click <b>Complile</b> button.<br/> <br/>
              This compiler is case insensitive, so you can use both upper case and lower case and it will not throw an error.<br/> <br/>
              Each program must end with <b>HLT</b> instruction <br/> <br/>
              Comments begin with the <b>;</b> and everything after <b>;</b> will be considered as comment. <br/> <br/>
              The code can have empty lines, compiler will ignore them. <br/><br/>
              <b>CODE MUST HAVE STRICT STRUCTURE. SEE EXAMPLE BELOW:</b>
              <code>
                {`  mvi a,05
  mvi b,05
  mvi c,05
  mov a,b
  mov a,c
  mov b,a
  mov b,c
  mov c,a
  mov c,b
  add a
  add b
  add c
  sub a
  sub b
  sub c
  hlt`}
              </code>
              <br/> <br/>
              In the code above you can see list of all instructions and how you must write them. <b>Writting them in any other way will result in an syntax error!!!</b><br/><br/>
              Your code will be compiled until compiler recognises a systax error. Once that happens the compilation will stop and compiler will show you number of the line where the error has occured togather with the code written on the line. <br/><br/>
              In the spirit of the programming, line numbers start from zero! 😁
            </p><br/><br/>
            <button onClick={this.toggleHelpDialog} >Close dialog</button>
          </div>
        </div>
        <button className={StyleSheet['help-button']} onClick={this.toggleHelpDialog}> Help </button>
        <button className={StyleSheet['compile-button']} onClick={this.compile}> Compile </button>
        <textarea 
          className={StyleSheet.workspace} 
          onChange={this.textArea_HandleChange}
          value={this.state.rawCode}
        ></textarea>
        {this.generateCompilationResult()}
      </div>
    )
  }
}
