import { JSDOM } from 'jsdom';

let handler = async (m, { conn, text }) => {

 function parseAnimeUpdates(html) {
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const animeUpdates = [];
      
        const articles = document.querySelectorAll('article.animeseries');
        articles.forEach((element) => {
          const title = element.querySelector('h3.title span')?.textContent || '';
          const link = element.querySelector('a')?.getAttribute('href') || '';
          const episode = element.querySelector('span.types.episodes')?.textContent || '';
          const imageUrl = element.querySelector('img')?.getAttribute('src') || '';
      
          animeUpdates.push({ title, link, episode, imageUrl });
        });
      
        return animeUpdates;
        }

 async function fetchAnimeUpdates() {
        const response = await fetch('https://nontonanimeid.autos/');
        const body = await response.text();
      
        return parseAnimeUpdates(body);
    }

    const animeUpdates = await fetchAnimeUpdates();
    const animeUpdate = animeUpdates[0];
    const { title, link, episode, imageUrl } = animeUpdate;
    const caption = `*${title}*\nEpisode: ${episode}\n\n${link}`;
    conn.sendFile(m.chat, imageUrl, 'anime.jpg', caption, m);

}

handler.help = ['anime-today']
handler.tags = ['anime']

handler.command = /^anime-update$/i

export default handler