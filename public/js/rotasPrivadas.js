async function validaToken() {
    let token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:3000/api/auth', {
        method: 'POST',
        headers: {
            'access-token': token
        }
    });

    console.log('teste')


    if (response.ok) {
        const result = await response.json();
        console.log("result")

        return true;
    } else {
        console.log('testandoooo')
        const result = await response.json();
        console.error(result.error);
        window.location.href = "/login.html";
    }
}
