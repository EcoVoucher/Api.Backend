document.addEventListener("DOMContentLoaded", () => {
    const cpfOuCnpjInput = document.getElementById("cpfOuCnpj");
    const passwordInput = document.getElementById("senha");
    const togglePasswordBtn = document.getElementById(
        "toggle-password-visibility"
    );
    const passwordIcon = togglePasswordBtn.querySelector("i");
    const cpfCnpjMessage = document.getElementById("cpfCnpjMessage");
    const passwordMessage = document.getElementById("passwordMessage");

    // Desabilitar o campo de senha inicialmente
    passwordInput.disabled = true;

    cpfOuCnpjInput.addEventListener("input", () => {
        const value = cpfOuCnpjInput.value.trim();
        if (isValidCpfCnpj(value)) {
            // Se CPF/CNPJ for válido, habilite o campo de senha
            passwordInput.disabled = false;
            cpfOuCnpjInput.classList.remove("is-invalid");
            cpfOuCnpjInput.classList.add("is-valid");
            cpfCnpjMessage.textContent = ""; // Limpa a mensagem de erro
        } else {
            // Se CPF/CNPJ for inválido, desabilite o campo de senha
            passwordInput.disabled = true;
            cpfOuCnpjInput.classList.remove("is-valid");
            cpfOuCnpjInput.classList.add("is-invalid");
            cpfCnpjMessage.textContent =
                "CPF ou CNPJ inválido. Por favor, verifique os dados.";
        }
    });

    passwordInput.addEventListener("input", () => {
        const password = passwordInput.value;
        if (isValidPassword(password)) {
            // Se a senha for válida, remover a mensagem de erro
            passwordInput.classList.remove("is-invalid");
            passwordInput.classList.add("is-valid");
            passwordMessage.textContent = "";
        } else {
            // Se a senha for inválida, mostrar a mensagem de erro
            passwordInput.classList.remove("is-valid");
            passwordInput.classList.add("is-invalid");
            passwordMessage.textContent = "A senha deve ter pelo menos 8 caracteres, incluindo letras, números e pelo menos um caractere especial.";
        }
    });

    togglePasswordBtn.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordIcon.classList.remove("fa-eye-slash");
            passwordIcon.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            passwordIcon.classList.remove("fa-eye");
            passwordIcon.classList.add("fa-eye-slash");
        }
    });

    document.getElementById('login-form').addEventListener("submit", async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário

        const cpfOuCnpj = cpfOuCnpjInput.value.trim();
        const senha = passwordInput.value;

        if (!isValidCpfCnpj(cpfOuCnpj) || !isValidPassword(senha)) {
            return;
        }

        try {
            console.log(senha)
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identidade: cpfOuCnpj, senha: senha }),
                credentials: "include", // Inclui cookies nas requisições, necessário para HttpOnly cookies
            });

            if (!response.ok) {
                throw new Error("Verifique suas credenciais! Usuário ou senha inválida!");
            }

            const data = await response.json();
            if (data.auth && !data.error) {
                window.alert("Usuário autenticado com sucesso.");
                localStorage.setItem('authToken', data.access_token);
                window.location.href = "/indexPegada.html";
            }

        } catch (error) {
            console.error("Erro:", error);
            window.alert(error.message);
        }
    });

    function isValidCpfCnpj(value) {
        // Remove caracteres não numéricos
        value = value.replace(/[^\d]+/g, "");

        if (value.length === 11) {
            // Validar CPF
            return validateCPF(value);

        } else if (value.length === 14) {
            // Validar CNPJ
            return validateCNPJ(value);
        } else {
            return false;
        }
    }

    function validateCPF(cpf) {
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;
        return true;
    }

    function validateCNPJ(cnpj) {
        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

        let length = cnpj.length - 2;
        let numbers = cnpj.substring(0, length);
        let digits = cnpj.substring(length);
        let sum = 0;
        let pos = length - 7;
        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;

        length = length + 1;
        numbers = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;
        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(1))) return false;

        return true;
    }

    function isValidPassword(password) {
        // A senha deve ter pelo menos 8 caracteres, incluindo letras, números e pelo menos um caractere especial
        const minLength = 8;
        const hasLetters = /[A-Za-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[@$!%*?&]/.test(password);

        return (
            password.length >= minLength &&
            hasLetters &&
            hasNumbers &&
            hasSpecial
        );
    }

    async function fetchProtectedResource() {
        await renewToken();

        try {
            const response = await fetch("http:localhost:3000", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getCsrfToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Falha ao buscar recurso protegido");
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Erro:", error);
            window.alert("Falha ao acessar recurso protegido.");
        }
    }

    function getCsrfToken() {
        // Supõe que o servidor envia um CSRF token como um cookie seguro
        const csrfCookie = document.cookie
            .split(";")
            .find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));
        if (!csrfCookie) return null;
        return csrfCookie.split("=")[1];
    }

    async function renewToken() {
        const oldToken = getCookie("jwt");
        if (!oldToken || isTokenExpiring(oldToken)) {
            try {
                const response = await fetch("http:/localhost:3000/renew", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "access-token": `${getCsrfToken()}`, // Adiciona o CSRF token
                    },
                });

                if (!response.ok) {
                    throw new Error("Falha ao renovar token");
                }

                // O novo token JWT será automaticamente armazenado como um cookie HttpOnly
            } catch (error) {
                console.error("Erro ao renovar token:", error);
                window.alert(
                    "Sessão expirada. Por favor, faça login novamente."
                );
                window.location.href = "/login";
            }
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    function isTokenExpiring(token) {
        if (!token) return true;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        return exp - currentTime < 300; // Expira em menos de 5 minutos
    }
});
