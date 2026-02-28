
const https = require('https');

const url = 'https://yetxvsesgzfoqphgakab.supabase.co/storage/v1/object/public/images/services/service-icon-1771308037296.jpg';

https.get(url, (res) => {
    console.log('StatusCode:', res.statusCode);
    console.log('Headers:', res.headers);
}).on('error', (e) => {
    console.error(e);
});
