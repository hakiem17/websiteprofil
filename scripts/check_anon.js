
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envConfig = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envConfig[key.trim()] = value.trim();
    }
});

const supabaseUrl = envConfig['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envConfig['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

// Using service role key to inspect DB if possible, but I don't have it.
// I can only use the anon key provided.
// To check policies via SQL, I can't unless I use a migration or have direct access.
// But I can try to fetch as 'anon' user (which the script already does).

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAnonFetch() {
    console.log('Fetching as anon...');
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Fetch error:', error);
    } else {
        console.log('Fetch success. Keys:', data && data.length > 0 ? Object.keys(data[0]) : 'No data');
    }
}

checkAnonFetch();
