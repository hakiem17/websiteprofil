const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDocuments() {
    console.log('Checking program_documents table...');
    const { data, error } = await supabase
        .from('program_documents')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching documents:', error);
    } else {
        console.log(`Found ${data.length} documents.`);
        data.forEach(doc => {
            console.log(`- [${doc.category}] ${doc.title} (${doc.year})`);
        });
    }
}

checkDocuments();
