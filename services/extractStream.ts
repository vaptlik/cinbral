// services/extractStream.ts

export interface StreamData {
  url: string;
  referer: string;
  origin: string;
}

export const extractStream = async (
  id: string,
  type: 'filme' | 'serie',
  season?: string,
  episode?: string
): Promise<StreamData | null> => {
  try {
    // 1. Monta a URL baseada na lógica do seu player antigo
    let embedUrl = '';
    if (type === 'serie' && season && episode) {
      embedUrl = `https://myembed.biz/serie/${id}/${season}/${episode}`;
    } else if (type === 'serie') {
      embedUrl = `https://myembed.biz/serie/${id}`;
    } else {
      embedUrl = `https://myembed.biz/filme/${id}`;
    }

    // 2. Faz a requisição para pegar o HTML
    const response = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    
    const html = await response.text();
    
    // 3. Padrões Regex para encontrar o arquivo M3U8 (do seu código novo)
    const patterns = [
      /(https:\/\/vid\d+\.[^"']+\.[^"']+\/[^"']+\.m3u8[^"']*)/i,
      /(https:\/\/[^"']+\.m3u8\?[^"']*)/i,
      /["'](https:\/\/[^"']+\/playlist\.m3u8)["']/i,
      /sources\s*:\s*\[\s*{\s*file\s*:\s*["']([^"']+)["']/i,
      /src:\s*["']([^"']+\.m3u8)["']/i,
      /var\s+source\s*=\s*["']([^"']+\.m3u8)["']/i,
      /"file"\s*:\s*"([^"]+\.m3u8)"/i,
      /(https:\/\/[^"']+\.m3u8)/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1].includes('.m3u8')) {
        return {
          url: match[1],
          referer: 'https://myembed.biz/',
          origin: 'https://myembed.biz'
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Erro na extração:', error);
    return null;
  }
};