document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const modeloSelecionado = document.getElementById('modelo-selecionado');
    const perguntaIa = document.getElementById('perguntaIa');
    const botao = document.getElementById('botao');
    const statusText = document.getElementById('statusText');
    const loadingGif = document.getElementById('loadingGif');
    const responseArea = document.getElementById('responseArea');

    botao.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        const pergunta = perguntaIa.value.trim();
        const modelo = modeloSelecionado.value;

        if (!apiKey) {
            statusText.textContent = 'Preencha o campo da chave da API';
            statusText.style.color = 'red';
            return;
        }

        if (!pergunta) {
            statusText.textContent = 'Campo pergunta não preenchido';
            statusText.style.color = 'red';
            return;
        }

        statusText.textContent = '';
        loadingGif.style.display = 'inline-block';
        responseArea.textContent = '';

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "contents": [{
                        "parts": [{ "text": pergunta }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `Erro da API: ${response.status}`);
            }

            const data = await response.json();
            const respostaTexto = data.candidates[0].content.parts[0].text;

            loadingGif.style.display = 'none';
            responseArea.textContent = respostaTexto;
/*             statusText.textContent = 'Pronto!';
            statusText.style.color = 'green'; */

        } catch (error) {
            loadingGif.style.display = 'none';
            statusText.textContent = `Erro: ${error.message}`;
            statusText.style.color = 'red';
            responseArea.textContent = '';
            console.error('Erro na chamada da API:', error);
        }
    });
});
