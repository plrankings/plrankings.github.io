var locales = ['pt-BR'];
var has_lang_param = window.location.search.startsWith('?lang');
var fixed_translation = window.location.search.startsWith('?ft');

redirectToTranslation();

function redirectToTranslation() {
    let lang_param;

    if (fixed_translation) {
        return;
    }

    if (!has_lang_param) {
        if (locales.indexOf(navigator.language)>=0 && navigator.language!=document.querySelector('html').lang && !fixed_translation) {
            window.location.href=`index-${locales[locales.indexOf(navigator.language)]}.html`;
        } else {
            return;
        }
    } 
    else {
        lang_param = window.location.search.split('=')[1];
        if (lang_param.length>0) {
            let lang_sufix = (lang_param=='en') ? '' : `-${lang_param}`;    
            window.location.href=`index${lang_sufix}.html?ft`;
        }
    }
}
