import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Proteção contra falha de desenho (revisão do site de 19/11/2026, dados.md item 1): um erro num pedaço da tela
 * (um cartão, uma questão) não derruba a página inteira. No lugar do pedaço aparece um aviso com "Tentar de novo";
 * trocar a `chave` (outro cartão, outra rota) recomeça.
 */
export class Protecao extends Component<{ children: ReactNode; chave?: string; texto?: string; aoPular?: () => void }, { erro: boolean; chave?: string }> {
  state = { erro: false, chave: this.props.chave };
  static getDerivedStateFromError() { return { erro: true }; }
  static getDerivedStateFromProps(p: { chave?: string }, s: { erro: boolean; chave?: string }) {
    return p.chave !== s.chave ? { erro: false, chave: p.chave } : null;
  }
  componentDidCatch(e: Error, info: ErrorInfo) { console.error('Falha ao desenhar', e, info.componentStack); }
  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div className="protecao folha" role="alert">
        <p><b>{this.props.texto || 'Esta parte da tela não abriu.'}</b> O resto continua funcionando, e o seu progresso está salvo.</p>
        <div className="protecao-acoes">
          <button className="btn sec" onClick={() => this.setState({ erro: false })}>Tentar de novo</button>
          {this.props.aoPular && <button className="btn" onClick={this.props.aoPular}>Pular</button>}
        </div>
      </div>
    );
  }
}
