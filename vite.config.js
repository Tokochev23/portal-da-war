
import { defineConfig } from 'vite';
import { resolve } from 'path';

// Nomes dos arquivos HTML que servirão como pontos de entrada
const entryPoints = [
  'index.html',
  'criador-aeronaves.html',
  'criador-navios.html',
  'criador-veiculos-refatorado.html',
  'dashboard.html',
  'narrador.html'
];

// Mapeia os nomes dos arquivos para caminhos absolutos
const input = entryPoints.reduce((acc, current) => {
  const name = current.split('.')[0];
  acc[name] = resolve(__dirname, current);
  return acc;
}, {});

export default defineConfig({
  base: '/War1954-main/', // Necessário para o deploy no GitHub Pages
  build: {
    rollupOptions: {
      input,
    },
    outDir: 'dist', // Pasta de saída para os arquivos de build
  },
  server: {
    port: 3000, // Porta para o servidor de desenvolvimento
  },
});
