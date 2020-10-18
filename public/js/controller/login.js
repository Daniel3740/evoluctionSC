document.querySelector('#enviar').addEventListener('click', (e) => {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value
     if (username === '' && password === ''){

        alert('Por favor ingrese un usuario y contraseña')
    }else{
        axios.post('/api/login/acceso', {
            username: username,
            password: password
          })
          .then((response) => {
            console.log(response);
            sessionStorage.setItem('username', response.data.username);
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('id', response.data.id);
            window.location.href = response.data.redirect;
          }, (error) => {
            alert('Usuario ó ontraseña incorrectos intenten nuevamente');
          });
    }
})

