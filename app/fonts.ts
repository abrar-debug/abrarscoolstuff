import localFont from 'next/font/local';

export const playfair = localFont({
  src: [
    {
      path: './public/fonts/Playfair-VariableFont_opsz,wdth,wght.ttf',
      style: 'normal',
    },
    {
      path: './public/fonts/Playfair-Italic-VariableFont_opsz,wdth,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',
});

export const poiretOne = localFont({
  src: './public/fonts/PoiretOne-Regular.ttf',
  variable: '--font-poiret',
}); 