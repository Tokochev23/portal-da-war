
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Nomes dos arquivos HTML que servirão como pontos de entrada
const entryPoints = [
  'index.html',
  'criador-aeronaves.html',
  'criador-navios.html',
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
  base: '/portal-da-war/', // Necessário para o deploy no GitHub Pages
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'assets/flags/**/*',
          dest: 'assets/flags'
        }
      ]
    })
  ],
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
