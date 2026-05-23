/**
 * api.js - Gerenciamento de chamadas de dados externos (APIs)
 * Este arquivo contém as funções responsáveis por buscar dados reais ou simulados
 * para alimentar os widgets de utilidade pública do Portal Manauara.
 */

/* Objeto de configuração centralizado para as URLs das APIs utilizadas */
const API_CONFIG = {
    /* URL da API Open-Meteo configurada com as coordenadas exatas de Manaus (-3.119, -60.0217) */
    WEATHER_URL: 'https://api.open-meteo.com/v1/forecast?latitude=-3.119&longitude=-60.0217&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto',
    /* Endpoint de exemplo para futuras integrações (ex: cotação de moedas ou nível do rio) */
    RIVER_DATA_URL: 'https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/USD' 
};

/**
 * Busca dados climáticos reais de Manaus.
 * Utiliza o serviço gratuito Open-Meteo que não requer chave de acesso.
 * @returns {Promise} Objeto contendo temperatura, condição textual e ícone.
 */
async function fetchManausWeather() {
    try {
        /* Realiza a chamada HTTP assíncrona para a API de clima */
        const response = await fetch(API_CONFIG.WEATHER_URL);
        /* Se a resposta não for bem-sucedida (ex: servidor fora do ar), dispara um erro */
        if (!response.ok) throw new Error('Falha na requisição do clima');
        
        /* Converte o corpo da resposta de JSON para um objeto JavaScript manipulável */
        const data = await response.json();
        /* Arredonda a temperatura atual para o número inteiro mais próximo */
        const temp = Math.round(data.current.temperature_2m);
        /* Obtém o código meteorológico (WMO Code) que define a condição do tempo */
        const code = data.current.weather_code;

        /* Define valores padrão para a condição e o ícone */
        let condition = 'Limpo';
        let icon = '☀️';

        /* Mapeamento lógico: Traduz o código numérico da API em ícones e textos em português */
        if (code >= 1 && code <= 3) { icon = '⛅'; condition = 'Parcialmente Nublado'; }
        else if (code >= 45 && code <= 48) { icon = '🌫️'; condition = 'Nevoeiro'; }
        else if (code >= 51 && code <= 67) { icon = '🌧️'; condition = 'Chuva Leve'; }
        else if (code >= 71 && code <= 82) { icon = '🌨️'; condition = 'Chuva Forte'; }
        else if (code >= 95) { icon = '⛈️'; condition = 'Tempestade'; }

        /* Retorna o objeto formatado para quem chamou a função */
        return {
            temp: temp,
            condition: condition,
            icon: icon
        };
    } catch (error) {
        /* Caso ocorra qualquer erro na busca, loga o erro e retorna dados padrão de segurança */
        console.error('Erro ao buscar clima real, usando dados simulados:', error);
        return {
            temp: 31,
            condition: 'Nublado',
            icon: '☁️'
        };
    }
}

/**
 * Simula a busca do nível do Rio Negro buscando de um arquivo JSON local.
 * Isso permite atualização manual simples no arquivo assets/data/river.json.
 * @returns {Promise} Objeto contendo o nível em metros, status e data.
 */
async function fetchRiverLevel() {
    try {
        /* Realiza a chamada para o arquivo JSON local que contém os dados do rio */
        const response = await fetch('../assets/data/river.json');
        
        /* Se o arquivo não for encontrado na pasta assets (tentativa a partir da raiz) */
        if (!response.ok) {
            const rootResponse = await fetch('assets/data/river.json');
            if (!rootResponse.ok) throw new Error('Dados do rio não encontrados');
            const data = await rootResponse.json();
            return {
                level: data.river_level,
                status: data.status,
                date: data.last_update
            };
        }

        const data = await response.json();
        
        /* Retorna os dados formatados conforme a estrutura esperada pelo main.js */
        return {
            level: data.river_level,
            status: data.status,
            date: data.last_update
        };
    } catch (error) {
        /* Caso o arquivo JSON falhe, retorna um valor fixo de segurança (Fallback) */
        console.error('Erro ao ler arquivo do rio, usando fallback:', error);
        return {
            level: 26.50,
            status: 'Estável',
            date: '18/05/2026'
        };
    }
}


