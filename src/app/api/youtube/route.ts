import { NextResponse } from "next/server";

// YouTube Channel ID for: Media Center HST
// If this is incorrect, please replace it with the correct Channel ID.
// You can find a channel ID by viewing the page source of the channel page and searching for "externalId" or "channelId".
const CHANNEL_ID = "UCXVJroYPW6e1GhWz501XZ3g"; // Media Center HST Channel ID

export async function GET() {
    try {
        // Use the RSS feed which doesn't require an API key
        const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, {
            next: { revalidate: 0 } // No cache
        });

        if (!response.ok) {
            throw new Error(`YouTube RSS fetch failed: ${response.status}`);
        }

        const xmlText = await response.text();

        // Simple Regex Parsing for RSS Feed
        // Note: a proper XML parser is better, but this avoids adding heavy dependencies for a simple feed.
        const videos = [];
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let match;

        while ((match = entryRegex.exec(xmlText)) !== null) {
            const entryContent = match[1];

            const idMatch = /<yt:videoId>(.*?)<\/yt:videoId>/.exec(entryContent);
            const titleMatch = /<title>(.*?)<\/title>/.exec(entryContent);
            const publishedMatch = /<published>(.*?)<\/published>/.exec(entryContent);

            if (idMatch && titleMatch && publishedMatch) {
                videos.push({
                    id: idMatch[1], // Use youtubeId as id
                    youtubeId: idMatch[1],
                    title: titleMatch[1],
                    publishedAt: publishedMatch[1],
                    // Relative time will be calculated on the client
                });
            }
        }

        return NextResponse.json(videos);
    } catch (error) {
        console.error("Error fetching YouTube feed:", error);

        // Fallback data if RSS feed fails (e.g. 404 or rate limit)
        // Updated: 2026-02-19
        const fallbackVideos = [
            {
                id: "YdAbwOK9n_s",
                youtubeId: "YdAbwOK9n_s",
                title: "DON'T PANIC BUYING",
                publishedAt: "4 hours ago"
            },
            {
                id: "MNe0rPrcXiY",
                youtubeId: "MNe0rPrcXiY",
                title: "Pasar Murah dan Baksos Bantu Tekan Inflasi Jelang Ramadan",
                publishedAt: "23 hours ago"
            },
            {
                id: "caneEy-uyyE",
                youtubeId: "caneEy-uyyE",
                title: "Gotong Royong PK2D Rantau Keminting Perkuat Peran Keluarga dan Kepedulian Warga",
                publishedAt: "2 days ago"
            },
            {
                id: "xh7jQUZMPSE",
                youtubeId: "xh7jQUZMPSE",
                title: "Fokuskan RKPD 2027 Kecamatan Hantakan Selaras Visi HST Religius, Sejahtera, dan Bermartabat",
                publishedAt: "2 days ago"
            },
            {
                id: "TGzEkBYaDz0",
                youtubeId: "TGzEkBYaDz0",
                title: "Pasar Murah Jelang Ramadan Tekan Inflasi, Warga Terbantu Penuhi Kebutuhan Pokok",
                publishedAt: "7 days ago"
            },
            {
                id: "Ub-kRWWXbbs",
                youtubeId: "Ub-kRWWXbbs",
                title: "DiskominfoSP HST Kunjungi KIM Desa Jatuh Perkuat Pembinaan Berkelanjutan Publikasi Desa",
                publishedAt: "8 days ago"
            }
        ];

        return NextResponse.json(fallbackVideos);
    }
}
