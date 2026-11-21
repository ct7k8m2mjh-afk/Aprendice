import type { CapacitorConfig } from '@capacitor/cli';

// Mesmo código do site, empacotado como app de iPhone e Android.
// Gerar os projetos nativos: npm run build && npx cap add android && npx cap add ios (iOS exige um Mac com Xcode).
const config: CapacitorConfig = {
  appId: 'br.com.aprendice.app',
  appName: 'Aprendice',
  webDir: 'dist',
  backgroundColor: '#F1F1EE',
};

export default config;
