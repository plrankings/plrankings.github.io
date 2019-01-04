var locales = ['pt-BR'];

if (locales.indexOf(navigator.language)>=0) {
    window.location.href=`index-${locales[locales.indexOf(navigator.language)]}.html`;
}