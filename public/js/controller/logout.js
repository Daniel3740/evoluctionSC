document.querySelector('#logout').addEventListener('click', (e) => {
    sessionStorage.clear();
    window.location.href = '../';
    console.log('cerrar sesion');

})