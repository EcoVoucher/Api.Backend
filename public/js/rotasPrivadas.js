async function validaToken() {
    let token = localStorage.getItem('authToken');
    console.log(token);
    const response = await fetch('http://localhost:4000/api/auth', {
        method: 'POST',
        headers: {
            'access-token': token
        }
    });

    if (response.ok) {
        const result = response.json();
        return true;
    } else {
        const result = await response.json();
        console.error(result.error);
        window.location.href = "/login.html";
    }
}
